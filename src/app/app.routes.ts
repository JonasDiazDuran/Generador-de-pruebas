import { Routes } from '@angular/router';
import { ExamComponent } from './components/exam/exam.component';
import { AppComponent } from './app.component';

export const routes: Routes = [
    {
        path : 'exam/:id',
        component : ExamComponent
        
    },
    { path: 'login/:token', component: AppComponent },
    { path: '', component: AppComponent }
];
