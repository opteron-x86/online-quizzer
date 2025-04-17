import { Question as AppQuestion } from '../components/quiz/QuestionCard';

// Define interfaces for the JSON data structure
interface QuestionChoice {
  a: string;
  b: string;
  c: string;
  d: string;
}

interface QuestionData {
  id: number;
  question: string;
  choices: QuestionChoice;
  answer: string;
  images?: string[];
  explanation?: string;
}

interface QuestionBank {
  testName: string;
  instructions: string;
  questions: QuestionData[];
}

// In Vite, you can directly import JSON files
// Let's create an object to hold imported JSON files
const importedQuestionBanks: Record<string, () => Promise<{ default: QuestionBank }>> = {
  'D426_FULL': () => import('@/assets/data/D426/d426_practice_test.json'),
  'D426_CH1': () => import('@/assets/data/D426/d426_chapter_1_quiz.json'),
  'D426_CH2': () => import('@/assets/data/D426/d426_chapter_2_quiz.json'),
  'D426_CH3': () => import('@/assets/data/D426/d426_chapter_3_quiz.json'),
  'D426_CH4': () => import('@/assets/data/D426/d426_chapter_4_quiz.json'),
  'D426_CH5': () => import('@/assets/data/D426/d426_chapter_5_quiz.json'),
  'D426_CH6': () => import('@/assets/data/D426/d426_chapter_6_quiz.json'),
  'D426_PRE': () => import('@/assets/data/D426/d426_preassessment.json'),
};

/**
 * Service to load and process question data from JSON files
 */
export const questionDataService = {
  /**
   * Loads question data from an imported JSON file
   * @param bankId - The question bank ID
   * @returns Promise that resolves to the loaded question bank
   */
  loadQuestionBank: async (bankId: string): Promise<QuestionBank> => {
    try {
      // Check if we have an import for this bank
      if (!importedQuestionBanks[bankId]) {
        throw new Error(`No question bank available for: ${bankId}`);
      }
      
      // Use dynamic import to get the JSON
      const questionBankModule = await importedQuestionBanks[bankId]();
      
      // With Vite, the default export is the JSON content
      const data: QuestionBank = questionBankModule.default;
      
      return data;
    } catch (error) {
      console.error(`Error loading question bank ${bankId}:`, error);
      throw error;
    }
  },
  
  /**
   * Converts question data from the JSON format to the app's expected format
   * @param questionData - The question data from the JSON file
   * @param courseId - The course ID for organizing image paths
   * @returns An array of questions in the app's expected format
   */
  convertToAppFormat: (questionData: QuestionData[], courseId: string): AppQuestion[] => {
    return questionData.map(q => {
      // Convert the choices object to an array of option objects
      const options = Object.entries(q.choices).map(([key, text]) => ({
        id: key,
        text
      }));
      
      // Create image paths with both relative and absolute paths for fallback
      const imageUrls = q.images?.map(img => `/src/assets/images/${courseId}/${img}`) || [];
      
      // Create alternative path options for each image to handle potential loading issues
      const imagePathOptions = q.images?.map(img => ({
        primary: `/src/assets/images/${courseId}/${img}`,
        fallback: `${import.meta.env.BASE_URL}assets/images/${courseId}/${img}`,
        lastResort: `./assets/images/${courseId}/${img}`
      })) || [];
      
      return {
        id: q.id.toString(),
        question: q.question,
        options,
        correctAnswer: q.answer.toLowerCase(),
        explanation: q.explanation,
        imageUrls,
        imagePathOptions
      };
    });
  },
  
  /**
   * Gets questions for a specific bank
   * @param bankId - The ID of the question bank
   * @param courseId - The ID of the course (for image paths)
   * @returns Promise that resolves to an array of questions in the app's format
   */
  getQuestionsForBank: async (bankId: string, courseId: string): Promise<AppQuestion[]> => {
    try {
      const questionBank = await questionDataService.loadQuestionBank(bankId);
      return questionDataService.convertToAppFormat(questionBank.questions, courseId);
    } catch (error) {
      console.error(`Error getting questions for bank ${bankId}:`, error);
      throw error;
    }
  },
  
  /**
   * Gets questions for a specific course (using the default bank)
   * @param courseId - The ID of the course
   * @returns Promise that resolves to an array of questions in the app's format
   */
  getQuestionsForCourse: async (courseId: string): Promise<AppQuestion[]> => {
    try {
      // Map course ID to its default question bank
      const defaultBankId = `${courseId}_FULL`;
      return questionDataService.getQuestionsForBank(defaultBankId, courseId);
    } catch (error) {
      console.error(`Error getting questions for course ${courseId}:`, error);
      throw error;
    }
  }
};

export default questionDataService;