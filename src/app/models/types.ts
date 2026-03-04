export interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
}

export interface ExamQuestion extends Question {
  shuffledOptions: string[];
  shuffledCorrectAnswer: number;
}

export interface ExamResult {
  id: string;
  studentName: string;
  date: string;
  score: number;
  totalQuestions: number;
  percentage: number;
  answers: DetailedAnswer[];
}

export interface DetailedAnswer {
  questionId: number;
  questionText: string;
  selectedAnswer: string | null;
  correctAnswer: string;
  isCorrect: boolean;
}

export type AppView = 'home' | 'exam' | 'results' | 'bank';
