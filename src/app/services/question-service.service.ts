import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { environment } from '../Environment/Environment';

@Injectable({
  providedIn: 'root'
})
export class QuestionServiceService {
  urlBase = `${environment.apiUrl}Question`;

  constructor(private http: HttpClient) { }

  private manejarError(error: HttpErrorResponse) {
    return throwError(() => error);
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
      .pipe(catchError(err => this.manejarError(err)));
  }

  getById(id: number): Observable<any> {
    return this.http.get(`${this.urlBase}/${id}`)
      .pipe(catchError(err => this.manejarError(err)));
  }

  filter(form: any) : Observable<any> {
    return this.http.post(`${this.urlBase}/filter`, form)
      .pipe(catchError(err => this.manejarError(err)));
  }
}
