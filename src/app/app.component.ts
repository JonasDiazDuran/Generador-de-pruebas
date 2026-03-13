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
import { Router } from '@angular/router';
import { LoginService } from './services/login.service';
import { environment } from './Environment/Environment';

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
    CategoryComponent
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit {

  private examService = inject(ExamService);

  constructor(
    private toastr: ToastrService,
    private router: Router,
    private loginService: LoginService
  ) { }

  currentView: AppView = 'category';
  results$ = this.examService.getResults();
  tokenUrl: any;

  ngOnInit(): void {

    this.getToken();
    this.checkLogin();
    this.goToExam();

  }

  goToExam() {

    const segments = window.location.pathname.split('/');

    if (segments[1] === 'exam' && segments[2]) {
      this.currentView = 'exam';
    }

  }

  navigateTo(view: AppView) {
    this.currentView = view;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  navigateToExam() {
    this.router.navigate(['/exam'])
  }

  onExamComplete(_result: ExamResult) {
    this.currentView = 'results';
  }

  checkLogin() {

    const segments = window.location.pathname.split('/');
    const route = segments[1];
    const token = sessionStorage.getItem('token');

    // si no está logueado y no es exam ni login
    if (!token && route !== 'exam' && route !== 'login') {

      window.location.href = 'https://intranet.isfodosu.edu.do';
      return;

    }

    // si viene desde login con token
    if (route === 'login') {
      this.login();
    }

  }

  // obtiene el token desde la URL o sessionStorage
  getToken() {

    const segments = window.location.pathname.split('/');
    const route = segments[1];

    if (route === 'login' && segments[2]) {

      this.tokenUrl = segments[2];
      this.currentView = 'category';
      return;

    }

    const token = sessionStorage.getItem('token');

    if (token) {
      this.tokenUrl = token;
      this.loginService.rol = this.loginService.getRol(this.tokenUrl );

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
          alert(this.loginService.rol)
          // limpiar cache
          caches.keys()
            .then(cacheNames =>
              Promise.all(cacheNames.map(name => caches.delete(name)))
            )
            .then(() => console.log('Caché borrada correctamente'))
            .catch(error => console.error('Error al borrar la caché:', error));

          this.router.navigate(['layout']);

        }

      });

  }

}