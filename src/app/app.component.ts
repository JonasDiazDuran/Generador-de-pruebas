import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppView, ExamResult } from './models/types';
import { ExamService } from './services/exam.service';
import { HeaderComponent } from './components/header/header.component';
import { HomeComponent } from './components/home/home.component';
import { ExamComponent } from './components/exam/exam.component';
import { BankComponent } from './components/bank/bank.component';
import { ResultsComponent } from './components/results/results.component';
import { ToastComponent } from './components/toast/toast.component';
import { CategoryComponent } from './components/category/category.component';
import { ToastrService } from 'ngx-toastr';
import { LoginService } from './services/login.service';
import { environment } from './Environment/Environment';
import { initAlerts } from './helpers/alerts';
import { ResultExamComponent } from './components/result-exam/result-exam.component';
import { Router } from '@angular/router';
import { LoaderComponent } from './components/loader/loader.component';

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
    CategoryComponent,
    ResultExamComponent 
    
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit {

  private examService = inject(ExamService);

  constructor(
    private toastr: ToastrService,
    private loginService: LoginService,
    private router: Router,
  ) {}

  currentView: AppView = 'category';
  results$ = this.examService.getResults();
  tokenUrl: any;
  selectedResult!: ExamResult;

  ngOnInit(): void {
    initAlerts(this.toastr);

    this.handleRoute(); // 👈 ejecutar al inicio

    // this.getToken();     // 👈 primero obtiene token
    // this.checkLogin();   // 👈 luego valida acceso
    // this.goToExam();     // 👈 navega si viene a examen

    window.addEventListener('hashchange', () => {
      this.handleRoute(); // 👈 ejecutar cuando cambie la URL
    });
  }

  // 🔥 helper para leer hash correctamente
  private getSegments(): string[] {
    console.log(window.location.hash.replace('#/', '').split('/'));
    return window.location.hash.replace('#/', '').split('/');
  }

  goToExam() {
    const segments = this.getSegments();
    
    if (segments[0] === 'exam' && segments[1]) {
      this.currentView = 'exam';
    }
  }

  navigateTo(view: AppView) {
    this.currentView = view;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  onExamComplete(_result: ExamResult) {    
    this.selectedResult = _result;
    this.currentView = 'examResult';
  }

  checkLogin() {
    
    const segments = this.getSegments();
    const route = segments[0];
    const token = sessionStorage.getItem('token');

    // ❌ no logueado
    if (!token && route !== 'exam' && route !== 'login') {
      window.location.href = 'https://intranet.isfodosu.edu.do';
      return;
    }
    // 🔥 si viene desde login con token

    if (route === 'login' && this.tokenUrl) {
      this.login();
    }
  }

  getToken() {
    const segments = this.getSegments();
    const route = segments[0];

    // 🔥 token desde URL
    if (route === 'login' && segments[1]) {
      this.tokenUrl = segments[1];
      return;
    }

    // 🔥 token desde session
    const token = sessionStorage.getItem('token');

    if (token) {
      this.tokenUrl = token;
      this.loginService.rol = this.loginService.getRol(this.tokenUrl);
    }

  }

  login() {
    if (!this.tokenUrl) return;

    this.loginService.login(this.tokenUrl, environment.idSistema)
      .subscribe((data: any) => {
        if (data.success) {

          sessionStorage.setItem('usuario', JSON.stringify(data.data));
          sessionStorage.setItem('token', this.tokenUrl);
          sessionStorage.setItem('idPersona', data.data.idPersona);

          this.loginService.usuarioLogueado = data.data;
          this.loginService.token = this.tokenUrl;
          this.loginService.rol = this.loginService.getRol(data.token);

          // limpiar cache
          caches.keys()
            .then(cacheNames =>
              Promise.all(cacheNames.map(name => caches.delete(name)))
            )
            .then(() => console.log('Caché borrada correctamente'))
            .catch(error => console.error('Error al borrar la caché:', error));

          // 🔥 cambiar vista en vez de usar router
          this.currentView = 'category';
          this.router.navigate([''])
        }
        else{
          window.location.href = 'https://intranet.isfodosu.edu.do';

        }
      });
  }

  handleRoute() {
    this.getToken();
    this.checkLogin();
    this.goToExam();
  }
}