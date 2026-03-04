import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppView, ExamResult } from './models/types';
import { ExamService } from './services/exam.service';
import { HeaderComponent } from './components/header/header.component';
import { HomeComponent } from './components/home/home.component';
import { ExamComponent } from './components/exam/exam.component';
import { BankComponent } from './components/bank/bank.component';
import { ResultsComponent } from './components/results/results.component';
import { ToastComponent } from './components/toast/toast.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    HeaderComponent,
    HomeComponent,
    ExamComponent,
    BankComponent,
    ResultsComponent,
    ToastComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  private examService = inject(ExamService);

  currentView: AppView = 'home';
  results$ = this.examService.getResults();

  navigateTo(view: AppView) {
    this.currentView = view;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  onExamComplete(_result: ExamResult) {
    this.currentView = 'results';
  }
}
