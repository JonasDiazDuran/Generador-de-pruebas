import { Component, EventEmitter, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ExamQuestion, ExamResult } from '../../models/types';
import { ExamService } from '../../services/exam.service';
import { ToastService } from '../../services/toast.service';

type ExamPhase = 'setup' | 'taking' | 'review';

@Component({
  selector: 'app-exam',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './exam.component.html',
  styleUrl: './exam.component.css',
})
export class ExamComponent {
  @Output() complete = new EventEmitter<ExamResult>();

  private examService = inject(ExamService);
  private toastService = inject(ToastService);

  phase: ExamPhase = 'setup';
  studentName = '';
  questions: ExamQuestion[] = [];
  answers: Record<number, number | null> = {};
  currentPage = 0;
  result: ExamResult | null = null;

  QUESTIONS_PER_PAGE = 10;

  get totalPages(): number {
    return Math.ceil(this.questions.length / this.QUESTIONS_PER_PAGE);
  }

  get pages(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i);
  }

  get currentQuestions(): ExamQuestion[] {
    const start = this.currentPage * this.QUESTIONS_PER_PAGE;
    return this.questions.slice(start, start + this.QUESTIONS_PER_PAGE);
  }

  get answeredCount(): number {
    return Object.values(this.answers).filter(a => a !== null && a !== undefined).length;
  }

  getProgressPct(): number {
    return this.questions.length > 0 ? Math.round((this.answeredCount / this.questions.length) * 100) : 0;
  }

  getLetter(idx: number): string {
    return String.fromCharCode(65 + idx);
  }

  startExam() {
    if (!this.studentName.trim()) {
      this.toastService.error('Por favor ingresa tu nombre');
      return;
    }
    this.questions = this.examService.generateExam(100);
    this.answers = {};
    this.currentPage = 0;
    this.phase = 'taking';
    this.toastService.success('Examen generado con 100 preguntas aleatorias');
  }

  selectAnswer(questionId: number, optionIndex: number) {
    this.answers = { ...this.answers, [questionId]: optionIndex };
  }

  prevPage() {
    this.currentPage = Math.max(0, this.currentPage - 1);
  }

  nextPage() {
    this.currentPage = Math.min(this.totalPages - 1, this.currentPage + 1);
  }

  submitExam() {
    if (this.answeredCount < this.questions.length) {
      const unanswered = this.questions.length - this.answeredCount;
      this.toastService.warning(`Tienes ${unanswered} preguntas sin responder.`);
    }
    this.result = this.examService.gradeExam(this.questions, this.answers, this.studentName);
    this.complete.emit(this.result);
    this.phase = 'review';
    this.toastService.success(`Examen completado: ${this.result.percentage}%`);
  }

  restart() {
    this.phase = 'setup';
    this.studentName = '';
    this.questions = [];
    this.answers = {};
    this.currentPage = 0;
    this.result = null;
  }
}
