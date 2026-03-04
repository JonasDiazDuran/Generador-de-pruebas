export interface Question {
  id: number
  question: string
  options: string[]
  correctAnswer: number // index of the correct answer in original options
}

export interface ExamQuestion extends Question {
  shuffledOptions: string[]
  shuffledCorrectAnswer: number // index of the correct answer in shuffled options
}

export interface ExamResult {
  id: string
  studentName: string
  date: string
  score: number
  totalQuestions: number
  percentage: number
  answers: {
    questionId: number
    questionText: string
    selectedAnswer: string | null
    correctAnswer: string
    isCorrect: boolean
  }[]
}

export type AppView = "home" | "exam" | "results" | "bank"
