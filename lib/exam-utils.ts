import { Question, ExamQuestion, ExamResult } from "./types"
import questionBank from "./question-bank"

// Fisher-Yates shuffle
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

export function generateExam(numQuestions: number = 100): ExamQuestion[] {
  // Select random questions
  const selectedQuestions = shuffleArray(questionBank).slice(0, numQuestions)

  // Shuffle options for each question
  return selectedQuestions.map((q: Question) => {
    const correctAnswerText = q.options[q.correctAnswer]
    const shuffledOptions = shuffleArray(q.options)
    const shuffledCorrectAnswer = shuffledOptions.indexOf(correctAnswerText)

    return {
      ...q,
      shuffledOptions,
      shuffledCorrectAnswer,
    }
  })
}

export function gradeExam(
  questions: ExamQuestion[],
  answers: Record<number, number | null>,
  studentName: string
): ExamResult {
  let score = 0
  const detailedAnswers = questions.map((q) => {
    const selectedIndex = answers[q.id]
    const isCorrect = selectedIndex === q.shuffledCorrectAnswer
    if (isCorrect) score++

    return {
      questionId: q.id,
      questionText: q.question,
      selectedAnswer: selectedIndex !== null && selectedIndex !== undefined ? q.shuffledOptions[selectedIndex] : null,
      correctAnswer: q.shuffledOptions[q.shuffledCorrectAnswer],
      isCorrect,
    }
  })

  return {
    id: crypto.randomUUID(),
    studentName,
    date: new Date().toLocaleString("es-ES"),
    score,
    totalQuestions: questions.length,
    percentage: Math.round((score / questions.length) * 100),
    answers: detailedAnswers,
  }
}

export function getQuestionBank() {
  return questionBank
}
