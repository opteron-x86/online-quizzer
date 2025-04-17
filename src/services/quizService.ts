import { Question } from '../components/quiz/QuestionCard';
import { Course } from '../components/quiz/CourseSelection';
import { QuizSettingsData } from '../components/quiz/QuizSettings';
import { questionDataService } from './questionDataService';
import { questionBankService, QuestionBankListItem } from './questionBankService';

/**
 * Service for quiz-related functionality
 */
export const quizService = {
  /**
   * Fetches all available courses
   * @returns Promise that resolves to an array of courses
   */
  getCourses: async (): Promise<Course[]> => {
    // In a real application, this would fetch from an API
    // For now, we'll return a mock response
    const courses: Course[] = [
      {
        id: 'D426',
        code: 'D426',
        title: 'Data Management',
        description: 'Learn about data management foundations, including database concepts, normalization, SQL, and entity-relationship modeling.',
        totalQuestions: 69, // This matches the number of questions in d426_question_bank.json
        estimatedTime: 60,
        difficulty: 'intermediate',
        completionRate: 0,
      }
      // Additional courses would be added here
    ];
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return courses;
  },
  
  /**
   * Fetches a specific course by ID
   * @param courseId - The ID of the course to fetch
   * @returns Promise that resolves to a course or null if not found
   */
  getCourseById: async (courseId: string): Promise<Course | null> => {
    const courses = await quizService.getCourses();
    const course = courses.find(c => c.id === courseId) || null;
    return course;
  },
  
  /**
   * Fetches questions for a specific course with applied settings
   * @param courseId - The ID of the course
   * @param settings - Quiz settings to apply
   * @returns Promise that resolves to an array of questions
   */
  getQuestions: async (courseId: string, settings: QuizSettingsData): Promise<Question[]> => {
    try {
      // Use the questionDataService to load questions from the JSON file
      const questions = await questionDataService.getQuestionsForCourse(courseId);
      
      // Apply settings (shuffle, limit number, etc.)
      let filteredQuestions = [...questions];
      
      // Filter by categories if specified
      if (settings.categories && settings.categories.length > 0) {
        // In a real app, questions would have category IDs
        // filteredQuestions = questions.filter(q => settings.categories?.includes(q.categoryId));
      }
      
      // Shuffle if needed
      if (settings.shuffleQuestions) {
        filteredQuestions = filteredQuestions.sort(() => Math.random() - 0.5);
      }
      
      // Limit to the number of questions requested
      return filteredQuestions.slice(0, settings.numberOfQuestions);
    } catch (error) {
      console.error(`Error getting questions for course ${courseId}:`, error);
      throw new Error(`Failed to load questions for course ${courseId}`);
    }
  },
  
/**
   * Saves a quiz attempt to the history
   * @param courseId - The ID of the course
   * @param settings - Quiz settings
   * @param questions - Questions in the quiz
   * @param userAnswers - User's answers
   * @param startTime - When the quiz started
   * @param endTime - When the quiz ended
   * @param score - Score achieved
   * @returns Promise that resolves to the ID of the saved attempt
   */
saveQuizAttempt: async (
  courseId: string,
  settings: QuizSettingsData,
  questions: Question[],
  userAnswers: Record<string, string>,
  startTime: number,
  endTime: number,
  score: number
): Promise<string> => {
  // In a real application, this would save to an API or database
  // For now, we'll save to localStorage
  
  // Get question bank name if available
  let questionBankName = "Default Quiz";
  if (settings.questionBankId) {
    try {
      const banks = await questionBankService.listQuestionBanks(courseId);
      const selectedBank = banks.find((bank: QuestionBankListItem) => bank.id === settings.questionBankId);
      if (selectedBank) {
        questionBankName = selectedBank.name;
      }
    } catch (error) {
      console.error("Error fetching question bank details:", error);
    }
  }
  
  const attemptId = `quiz_${Date.now()}`;
  const quizAttempt = {
    id: attemptId,
    courseId,
    settings,
    questions,
    userAnswers,
    startTime,
    endTime,
    score,
    percentage: score / questions.length,
    questionCount: questions.length,
    questionBankId: settings.questionBankId || null,
    questionBankName
  };
  
  // Get existing history or initialize empty array
  const historyJSON = localStorage.getItem('quizHistory');
  const history = historyJSON ? JSON.parse(historyJSON) : [];
  
  // Add new attempt to history
  history.unshift(quizAttempt);
  
  // Save updated history
  localStorage.setItem('quizHistory', JSON.stringify(history));
  
  // Update course completion rate
  quizService.updateCourseCompletionRate(courseId);
  
  return attemptId;
},
  
  /**
   * Gets quiz history for a user
   * @param courseId - Optional course ID to filter by
   * @returns Promise that resolves to an array of quiz attempts
   */
  getQuizHistory: async (courseId?: string): Promise<QuizAttempt[]> => {
    // In a real application, this would fetch from an API
    // For now, we'll get from localStorage
    
    const historyJSON = localStorage.getItem('quizHistory');
    const history = historyJSON ? JSON.parse(historyJSON) : [];
    
    // Filter by course if specified
    if (courseId) {
      return history.filter((attempt: QuizAttempt) => attempt.courseId === courseId);
    }
    
    return history;
  },
  
  /**
   * Updates the completion rate for a course based on quiz history
   * @param courseId - The ID of the course to update
   * @returns Promise that resolves when the update is complete
   */
  updateCourseCompletionRate: async (courseId: string): Promise<void> => {
    // In a real application, this would be calculated on the server
    // For now, we'll calculate locally
    
    // Get quiz history for this course
    const history = await quizService.getQuizHistory(courseId);
    
    if (history.length === 0) {
      return;
    }
    
    // Calculate average score
    const totalPercentage = history.reduce((sum, attempt) => sum + attempt.percentage, 0);
    const averagePercentage = totalPercentage / history.length;
    
    // Get user progress from localStorage
    const progressJSON = localStorage.getItem('courseProgress');
    const progress = progressJSON ? JSON.parse(progressJSON) : {};
    
    // Update progress for this course
    progress[courseId] = {
      completionRate: Math.round(averagePercentage * 100),
      lastAttempt: new Date().toISOString(),
      attemptsCount: history.length
    };
    
    // Save updated progress
    localStorage.setItem('courseProgress', JSON.stringify(progress));
  },
  
  /**
   * Gets the course progress for all courses
   * @returns Promise that resolves to course progress data
   */
  getCourseProgress: async (): Promise<Record<string, {
    completionRate: number;
    lastAttempt: string;
    attemptsCount: number;
  }>> => {
    // In a real application, this would fetch from an API
    // For now, we'll get from localStorage
    
    const progressJSON = localStorage.getItem('courseProgress');
    return progressJSON ? JSON.parse(progressJSON) : {};
  }
};

/**
 * Interface for a quiz attempt
 */
interface QuizAttempt {
  id: string;
  courseId: string;
  settings: QuizSettingsData;
  questions: Question[];
  userAnswers: Record<string, string>;
  startTime: number;
  endTime: number;
  score: number;
  percentage: number;
  questionCount: number;
  questionBankId: string | null;
  questionBankName: string;
}

export default quizService;