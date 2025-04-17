/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState, ReactNode, useCallback, useEffect } from 'react';
import { quizService } from '../services/quizService';
import { questionBankService } from '../services/questionBankService';
import { QuestionBankListItem } from '../types/questionBank';
import { useLocalStorage } from '../hooks/useLocalStorage';

// Types
export interface Question {
  id: string;
  question: string;
  options: { id: string; text: string }[];
  correctAnswer: string;
  explanation?: string;
  imageUrls?: string[];
}

export interface Course {
  id: string;
  code: string;
  title: string;
  description: string;
  totalQuestions: number;
  estimatedTime: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  completionRate?: number;
  lastAttempt?: string;
}

export interface QuizSettingsData {
  numberOfQuestions: number;
  timeLimit: number;
  showFeedback: boolean;
  shuffleQuestions: boolean;
  categories?: string[];
  questionBankId?: string;   // For single bank selection
  selectedBankIds?: string[]; // For multiple bank selection
  courseId?: string;          // For course-specific file structure
  bankSelectionMode?: 'single' | 'multiple' | 'all'; // The mode of bank selection
}

export interface AppSettings {
  darkMode: boolean;
  defaultTimeLimit: number;
  defaultQuestionCount: number;
  showFeedback: boolean;
  shuffleQuestions: boolean;
}

export interface QuizState {
  courseId: string | null;
  settings: QuizSettingsData | null;
  questions: Question[];
  currentQuestionIndex: number;
  userAnswers: Record<string, string>;
  startTime: number | null;
  endTime: number | null;
  isComplete: boolean;
  score: number | null;
}

interface QuizContextType {
  quizState: QuizState;
  courses: Course[];
  questionBanks: QuestionBankListItem[];
  isLoading: boolean;
  error: string | null;
  appSettings: AppSettings;
  selectCourse: (courseId: string) => Promise<void>;
  startQuiz: (settings: QuizSettingsData) => Promise<void>;
  answerQuestion: (questionId: string, answerId: string) => void;
  goToNextQuestion: () => void;
  goToPreviousQuestion: () => void;
  goToQuestion: (index: number) => void;
  submitQuiz: () => Promise<void>;
  resetQuiz: () => void;
  loadQuestionBanks: (courseId: string) => Promise<void>;
  updateAppSettings: (settings: AppSettings) => void;
  getCourseProgress: () => Promise<Record<string, {
    completionRate: number;
    lastAttempt: string;
    attemptsCount: number;
  }>>;
}

// Default app settings
export const defaultAppSettings: AppSettings = {
  darkMode: false,
  defaultTimeLimit: 30, // minutes
  defaultQuestionCount: 10,
  showFeedback: true,
  shuffleQuestions: true
};

// Initial quiz state
const initialQuizState: QuizState = {
  courseId: null,
  settings: null,
  questions: [],
  currentQuestionIndex: 0,
  userAnswers: {},
  startTime: null,
  endTime: null,
  isComplete: false,
  score: null
};

// Create context
const QuizContext = createContext<QuizContextType | undefined>(undefined);

// Provider component
interface QuizProviderProps {
  children: ReactNode;
}

export const QuizProvider = ({ children }: QuizProviderProps) => {
  const [quizState, setQuizState] = useState<QuizState>(initialQuizState);
  const [courses, setCourses] = useState<Course[]>([]);
  const [questionBanks, setQuestionBanks] = useState<QuestionBankListItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const getCourseProgress = useCallback(async () => {
    try {
      return await quizService.getCourseProgress();
    } catch (error) {
      setError("Failed to load course progress");
      return {};
    }
  }, []);

  // Load app settings from localStorage
  const [appSettings, setAppSettings] = useLocalStorage<AppSettings>(
    'app-settings', 
    defaultAppSettings
  );

  // Load courses when provider mounts
  useEffect(() => {
    const loadCourses = async () => {
      setIsLoading(true);
      try {
        const loadedCourses = await quizService.getCourses();
        setCourses(loadedCourses);
        setError(null);
      } catch (err) {
        setError("Failed to load courses");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    loadCourses();
  }, []);

  // Update app settings
  const updateAppSettings = useCallback((newSettings: AppSettings) => {
    setAppSettings(newSettings);
  }, [setAppSettings]);

  // Load question banks for a course
  const loadQuestionBanks = useCallback(async (courseId: string): Promise<void> => {
    setIsLoading(true);
    try {
      const banks = await questionBankService.listQuestionBanks(courseId);
      setQuestionBanks(banks);
      setError(null);
      // → no return here, so Promise<void>
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to load question banks';
      setError(errorMessage);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Select a course
  const selectCourse = useCallback(async (courseId: string) => {
    setIsLoading(true);
    try {
      const selectedCourse = await quizService.getCourseById(courseId);
      if (!selectedCourse) {
        throw new Error(`Course with ID ${courseId} not found`);
      }
      
      // Reset quiz state but keep the courseId
      setQuizState({
        ...initialQuizState,
        courseId
      });
      
      // Also load question banks for this course
      await loadQuestionBanks(courseId);
      
      setError(null);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to select course';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [loadQuestionBanks]);

  // Start a quiz
  const startQuiz = useCallback(async (settings: QuizSettingsData) => {
    if (!quizState.courseId) {
      setError('No course selected');
      return Promise.reject('No course selected');
    }
    
    setIsLoading(true);
    try {
      let quizQuestions: Question[] = [];
      
      // If a question bank is specified, use that
      if (settings.questionBankId) {
        quizQuestions = await questionBankService.getQuestionsFromBank(settings.questionBankId, settings);
      } else {
        // Otherwise use the default question source from quizService
        quizQuestions = await quizService.getQuestions(quizState.courseId, settings);
      }
      
      setQuizState(prev => ({
        ...prev,
        settings,
        questions: quizQuestions,
        currentQuestionIndex: 0,
        userAnswers: {},
        startTime: Date.now(),
        endTime: null,
        isComplete: false,
        score: null
      }));
      
      setError(null);
      return Promise.resolve();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to start quiz';
      setError(errorMessage);
      return Promise.reject(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [quizState.courseId]);

  // Answer a question
  const answerQuestion = useCallback((questionId: string, answerId: string) => {
    setQuizState(prev => ({
      ...prev,
      userAnswers: {
        ...prev.userAnswers,
        [questionId]: answerId
      }
    }));
  }, []);

  // Go to the next question
  const goToNextQuestion = useCallback(() => {
    setQuizState(prev => {
      if (prev.currentQuestionIndex >= prev.questions.length - 1) {
        return prev; // Already at the last question
      }
      return {
        ...prev,
        currentQuestionIndex: prev.currentQuestionIndex + 1
      };
    });
  }, []);

  // Go to the previous question
  const goToPreviousQuestion = useCallback(() => {
    setQuizState(prev => {
      if (prev.currentQuestionIndex <= 0) {
        return prev; // Already at the first question
      }
      return {
        ...prev,
        currentQuestionIndex: prev.currentQuestionIndex - 1
      };
    });
  }, []);

  // Go to a specific question
  const goToQuestion = useCallback((index: number) => {
    setQuizState(prev => {
      if (index < 0 || index >= prev.questions.length) {
        return prev; // Invalid index
      }
      return {
        ...prev,
        currentQuestionIndex: index
      };
    });
  }, []);

  // Submit the quiz
  const submitQuiz = useCallback(async () => {
    try {
      setIsLoading(true);
      
      const endTime = Date.now();
      
      // Calculate score
      let correctAnswers = 0;
      quizState.questions.forEach(question => {
        const userAnswer = quizState.userAnswers[question.id];
        if (userAnswer === question.correctAnswer) {
          correctAnswers++;
        }
      });
      
      // Save the quiz attempt
      if (quizState.courseId && quizState.settings && quizState.startTime) {
        await quizService.saveQuizAttempt(
          quizState.courseId,
          quizState.settings,
          quizState.questions,
          quizState.userAnswers,
          quizState.startTime,
          endTime,
          correctAnswers
        );
      }
      
      // Update state
      setQuizState(prev => ({
        ...prev,
        isComplete: true,
        endTime,
        score: correctAnswers
      }));
      
      return Promise.resolve();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to submit quiz';
      setError(errorMessage);
      return Promise.reject(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [quizState]);

  // Reset the quiz
  const resetQuiz = useCallback(() => {
    setQuizState(prev => ({
      ...initialQuizState,
      courseId: prev.courseId
    }));
  }, []);

  const contextValue: QuizContextType = {
    quizState,
    courses,
    questionBanks,
    isLoading,
    error,
    appSettings,
    selectCourse,
    startQuiz,
    answerQuestion,
    goToNextQuestion,
    goToPreviousQuestion,
    goToQuestion,
    submitQuiz,
    resetQuiz,
    loadQuestionBanks,
    updateAppSettings,
    getCourseProgress
  };

  return (
    <QuizContext.Provider value={contextValue}>
      {children}
    </QuizContext.Provider>
  );
};

// Custom hook to use the quiz context
export const useQuiz = (): QuizContextType => {
  const context = useContext(QuizContext);
  if (context === undefined) {
    throw new Error('useQuiz must be used within a QuizProvider');
  }
  return context;
};

// Export the context as the default export
export default QuizContext;