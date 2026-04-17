import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, Observable, catchError, throwError } from 'rxjs';
import { Question, ExamQuestion, ExamResult, IExamQuestion, IRecinto, IQuestionCategory, IQuestion } from '../models/types';
import questionBank from '../data/question-bank';
import { environment } from '../Environment/Environment';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { ToastService } from '../services/toast.service';

@Injectable({ providedIn: 'root' })
export class ExamService {
  urlBase = `${environment.apiUrl}Question`;
  private toastService = inject(ToastService);

  public results$ = new BehaviorSubject<ExamResult[]>([]);
  constructor(private http: HttpClient) { }

  private manejarError(error: HttpErrorResponse) {
    this.toastService.error(error.message)
    return throwError(() => error);
  }
  getResults() {
    return this.results$.asObservable();
    
  }
  

  getResultsValue(): ExamResult[] {
    return this.results$.value;
  }

  getQuestionBank(): Question[] {
    return questionBank;
  }


  setResults(data: ExamResult[]) {
    this.results$.next(data);
  }
  generateExam(questions : IQuestion[],  numQuestions: number = 100): IExamQuestion[] {
    console.log(questions);
    
    const selectedQuestions = this.shuffleArray(questions).slice(0, numQuestions);
    console.log(selectedQuestions);
    
    
    // id : c.id,
    // questionText: c.questionText,
    // idCategory: c.idCategoria,
    // img : c.img,
    // correctOption  : c.correctAnswer,
    // questionOptions: c.questionOptions,
    // shuffledOptions : c.questionOptions,
    // shuffledCorrectAnswer : c.correctOption
    return selectedQuestions.map((q) => {

      const correctAnswerText = q.questionOptions[q.correctOption].optionText;
    
      const shuffledOptions = this
        .shuffleArray(q.questionOptions)
        .map(opt => opt.optionText);
    
      const shuffledCorrectAnswer = shuffledOptions.indexOf(correctAnswerText);
    
      return {
        id: q.id,
        questionText: q.questionText,
        idCategory: q.idCategory,
        img: q.img,
        questionOptions: q.questionOptions,
        correctOption: q.correctOption,
        shuffledOptions,
        shuffledCorrectAnswer,
      };
    });
  }

  gradeExam(
    questions: IExamQuestion[], 
    answers: Record<number, number | null>,
    studentName: string,
    email : string,
    sex : string,
    age : number,
    idRecinto :  number,
    // recintoObj : IRecinto,
    idCategoria : number,
    // categoriaobj :  IQuestionCategory,
    cedula : string

  ): ExamResult {
    let score = 0;
    const detailedAnswers = questions.map((q) => {
      const selectedIndex = answers[q.id];
      const isCorrect = selectedIndex === q.shuffledCorrectAnswer;

      if (isCorrect) score++;

      //     shuffledOptions: string[];
      // shuffledCorrectAnswer: number;

      return {
        questionId: q.id,
        questionText: q.questionText,
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
      studentName : studentName,
      date: new Date().toLocaleString('es-ES'),
      score : score,
      totalQuestions: questions.length, 
      approved : Math.round((score / questions.length) * 100)>70? true : false,
      percentage: Math.round((score / questions.length) * 100),
      sex : sex,
      email : email,
      age :  age,
      idCategoria : idCategoria,
      // categoriaObj : categoriaobj,
      cedula : cedula,
      idRecinto : idRecinto,
      // recintoObj : recintoObj,
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
 



  insert(form: any): Observable<any> {
    return this.http.post(this.urlBase, form)
      .pipe(catchError(err => this.manejarError(err)));
  }

  update(form: any): Observable<any> {
    return this.http.put(this.urlBase, form)
      .pipe(catchError(err => this.manejarError(err)));
  }

  delete(id: number): Observable<any> {
    return this.http.delete(`${this.urlBase}/${id}`)
      .pipe(catchError(
        err => this.manejarError(err)
      ));
  }


  deleteResult(id: string): Observable<any> {
    return this.http.delete(`${environment.apiUrl}exam/${id}`)
      .pipe(catchError(
        err => this.manejarError(err)
      ));
  }

  deleteResultAll(): Observable<any> {
    return this.http.delete(`${environment.apiUrl}exam/delete_all`)
      .pipe(catchError(
        err => this.manejarError(err)
      ));
  }

  reportWrongAnswrs(idCategory : number): Observable<any> {
    return this.http.get(`${environment.apiUrl}exam/report_wrong_answers?idCategory=${idCategory}`)
      .pipe(catchError(
        err => this.manejarError(err)
      ));
  }
  

  getById(id: number): Observable<any> {
    return this.http.get(`${this.urlBase}/${id}`)
      .pipe(catchError(err => this.manejarError(err)));
  }

  filter(form: any): Observable<any> {
    return this.http.post(`${this.urlBase}/filter`, form)
      .pipe(catchError(err => this.manejarError(err)));
  }


  createExam(form: any): Observable<any> {
    return this.http.post(`${environment.apiUrl}Exam`, form)
      .pipe(catchError(err => this.manejarError(err)));
  }

  filterExam(form: any): Observable<any> {
    return this.http.post(`${environment.apiUrl}Exam/filter`, form)
      .pipe(catchError(err => this.manejarError(err)));
  }
  getAllRecintos(): Observable<any> {
    return this.http.get(`${environment.apiUrl}Exam/recintos`)
      .pipe(catchError(err => this.manejarError(err)));
  }

  checkIdentity(cedula : string, correo : string): Observable<any> {
    return this.http.get(`${environment.apiUrl}Exam/check_identity/${cedula}/${correo}`)
      .pipe(catchError(err => this.manejarError(err)));
  }
}
