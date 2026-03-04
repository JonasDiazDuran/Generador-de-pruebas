import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Question, ExamQuestion, ExamResult } from '../models/types';
import questionBank from '../data/question-bank';

@Injectable({ providedIn: 'root' })
export class ExamService {
  private results$ = new BehaviorSubject<ExamResult[]>([]);

  getResults() {
    return this.results$.asObservable();
  }

  getResultsValue(): ExamResult[] {
    return this.results$.value;
  }

  getQuestionBank(): Question[] {
    return questionBank;
  }

  generateExam(numQuestions: number = 100): ExamQuestion[] {
    const selectedQuestions = this.shuffleArray(questionBank).slice(0, numQuestions);

    return selectedQuestions.map((q: Question) => {
      const correctAnswerText = q.options[q.correctAnswer];
      const shuffledOptions = this.shuffleArray(q.options);
      const shuffledCorrectAnswer = shuffledOptions.indexOf(correctAnswerText);

      return {
        ...q,
        shuffledOptions,
        shuffledCorrectAnswer,
      };
    });
  }

  gradeExam(
    questions: ExamQuestion[],
    answers: Record<number, number | null>,
    studentName: string
  ): ExamResult {
    let score = 0;
    const detailedAnswers = questions.map((q) => {
      const selectedIndex = answers[q.id];
      const isCorrect = selectedIndex === q.shuffledCorrectAnswer;
      if (isCorrect) score++;

      return {
        questionId: q.id,
        questionText: q.question,
        selectedAnswer:
          selectedIndex !== null && selectedIndex !== undefined
            ? q.shuffledOptions[selectedIndex]
            : null,
        correctAnswer: q.shuffledOptions[q.shuffledCorrectAnswer],
        isCorrect,
      };
    });

    const result: ExamResult = {
      id: crypto.randomUUID(),
      studentName,
      date: new Date().toLocaleString('es-ES'),
      score,
      totalQuestions: questions.length,
      percentage: Math.round((score / questions.length) * 100),
      answers: detailedAnswers,
    };

    this.results$.next([result, ...this.results$.value]);
    return result;
  }

  clearResults() {
    this.results$.next([]);
  }

  private shuffleArray<T>(array: T[]): T[] {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }
}
