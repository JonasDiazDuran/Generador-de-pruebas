import { Routes } from '@angular/router';
import { ExamComponent } from './components/exam/exam.component';

export const routes: Routes = [
    {
        path : 'exam/:id',
        component : ExamComponent
    }
];
