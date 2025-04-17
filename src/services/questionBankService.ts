import { Question } from '../contexts/QuizContext';
import { QuizSettingsData } from '../contexts/QuizContext';
import { questionDataService } from './questionDataService';

export interface QuestionBankListItem {
  id: string;
  name: string;
  description: string;
  questionCount: number;
  courseId: string;
  lastUpdated?: string;
  isDefault?: boolean;
}

/**
 * Service for managing question banks
 */
export const questionBankService = {
  /**
   * Lists available question banks for a course
   * @param courseId - The ID of the course
   * @returns Promise that resolves to an array of question bank list items
   */
  listQuestionBanks: async (courseId: string): Promise<QuestionBankListItem[]> => {
    // For now, we'll hard-code the question banks
    // In a real app, this would query an API or scan the directory
    if (courseId === 'D426') {
      return [
        {
          id: 'D426_FULL',
          name: 'Data Management Foundations Practice Test',
          description: 'WGU D426 Data Management practice questions covering all chapters',
          questionCount: 69,
          courseId: 'D426',
          lastUpdated: new Date().toISOString(),
          isDefault: true
        },
        {
          id: 'D426_PRE',
          name: 'Data Management Foundations Pre-Assessment',
          description: 'WGU D426 Data Management pre-assessment questions',
          questionCount: 60,
          courseId: 'D426',
          lastUpdated: new Date().toISOString(),
          isDefault: false
        },
        {
          id: 'D426_CH1',
          name: 'Data Management Foundations Chapter 1 Quiz',
          description: 'Chapter 1 - Introduction to Databases',
          questionCount: 12,
          courseId: 'D426',
          lastUpdated: new Date().toISOString(),
          isDefault: false
        },
        {
          id: 'D426_CH2',
          name: 'Data Management Foundations Chapter 2 Quiz',
          description: 'Chapter 2 - Relational Databases and SQL',
          questionCount: 12,
          courseId: 'D426',
          lastUpdated: new Date().toISOString(),
          isDefault: false
        },
        {
          id: 'D426_CH3',
          name: 'Data Management Foundations Chapter 3 Quiz',
          description: 'Chapter 3 - SQL Special Operators, Functions, and Joins',
          questionCount: 13,
          courseId: 'D426',
          lastUpdated: new Date().toISOString(),
          isDefault: false
        },
        {
          id: 'D426_CH4',
          name: 'Data Management Foundations Chapter 4 Quiz',
          description: 'Chapter 4 - Entity-Relationship Modeling & Database Design',
          questionCount: 25,
          courseId: 'D426',
          lastUpdated: new Date().toISOString(),
          isDefault: false
        },
        {
          id: 'D426_CH5',
          name: 'Data Management Foundations Chapter 5 Quiz',
          description: 'Chapter 5 - Database Storage and Indexing',
          questionCount: 25,
          courseId: 'D426',
          lastUpdated: new Date().toISOString(),
          isDefault: false
        },
        {
          id: 'D426_CH6',
          name: 'Data Management Foundations Chapter 6 Quiz',
          description: 'Chapter 6 - Database Architecture',
          questionCount: 25,
          courseId: 'D426',
          lastUpdated: new Date().toISOString(),
          isDefault: false
        }
      ];
    }
    return [];
  },

  /**
   * Gets questions from a specific question bank
   * @param bankId - The ID of the question bank
   * @param settings - Quiz settings to apply
   * @returns Promise that resolves to an array of questions
   */
  getQuestionsFromBank: async (bankId: string, settings: QuizSettingsData): Promise<Question[]> => {
    // Extract courseId from bankId or use settings
    const courseId = settings.courseId || bankId.split('_')[0]; // Assumes bank IDs follow the pattern "courseId_XXXX"
    
    try {
      // Use our questionDataService to get questions from the JSON file
      const questions = await questionDataService.getQuestionsForBank(bankId, courseId);
      
      // Apply settings
      let filteredQuestions = [...questions];
      
      // Shuffle if needed
      if (settings.shuffleQuestions) {
        filteredQuestions = filteredQuestions.sort(() => Math.random() - 0.5);
      }
      
      // Limit to the number of questions requested
      return filteredQuestions.slice(0, settings.numberOfQuestions);
    } catch (error) {
      console.error(`Error getting questions for bank ${bankId}:`, error);
      throw new Error(`Question bank with ID ${bankId} not found or could not be loaded`);
    }
  }
};

export default questionBankService;