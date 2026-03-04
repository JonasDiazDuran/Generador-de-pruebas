import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Question } from '../../models/types';
import { ExamService } from '../../services/exam.service';

interface Category {
  label: string;
  range: [number, number];
}

@Component({
  selector: 'app-bank',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './bank.component.html',
  styleUrl: './bank.component.css',
})
export class BankComponent {
  private examService = inject(ExamService);

  allQuestions: Question[] = this.examService.getQuestionBank();
  search = '';
  selectedCategory = 0;
  page = 0;
  ITEMS_PER_PAGE = 20;

  categories: Category[] = [
    { label: 'Todas', range: [1, 300] },
    { label: 'Ciencias Naturales', range: [1, 50] },
    { label: 'Matematicas', range: [51, 100] },
    { label: 'Historia', range: [101, 150] },
    { label: 'Geografia', range: [151, 200] },
    { label: 'Lengua y Literatura', range: [201, 250] },
    { label: 'Tecnologia', range: [251, 300] },
  ];

  get filtered(): Question[] {
    let questions = this.allQuestions;
    if (this.selectedCategory > 0) {
      const cat = this.categories[this.selectedCategory];
      questions = questions.filter(q => q.id >= cat.range[0] && q.id <= cat.range[1]);
    }
    if (this.search.trim()) {
      const s = this.search.toLowerCase();
      questions = questions.filter(q =>
        q.question.toLowerCase().includes(s) ||
        q.options.some(o => o.toLowerCase().includes(s))
      );
    }
    return questions;
  }

  get totalPages(): number {
    return Math.ceil(this.filtered.length / this.ITEMS_PER_PAGE);
  }

  get pageQuestions(): Question[] {
    return this.filtered.slice(this.page * this.ITEMS_PER_PAGE, (this.page + 1) * this.ITEMS_PER_PAGE);
  }

  getLetter(idx: number): string {
    return String.fromCharCode(65 + idx);
  }
}
