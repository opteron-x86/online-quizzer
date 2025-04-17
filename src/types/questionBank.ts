/**
 * Defines the structure for a question bank
 */

import { Question } from '../components/quiz/QuestionCard';

export interface QuestionBank {
  id: string;
  title: string;
  description: string;
  courseId: string;
  createdAt: number;
  updatedAt: number;
  questionCount: number;
  categories?: QuestionCategory[];
  questions: Question[];
}

export interface QuestionCategory {
  id: string;
  name: string;
  description?: string;
}

/**
 * Represents an entry in the list of question banks
 */
export interface QuestionBankListItem {
    id: string;
    name: string;
    description: string;
    questionCount: number;
    courseId: string;
    lastUpdated?: string;
    isDefault?: boolean;
  }