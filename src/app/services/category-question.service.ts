import { Injectable, inject } from '@angular/core';
import { environment } from '../Environment/Environment';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { ServiceResponse } from '../models/types';
import { ToastService } from './toast.service';
import * as Alerts from '../helpers/alerts';

@Injectable({
  providedIn: 'root'
})
export class CategoryQuestionService {
  private toastService = inject(ToastService);

  urlBase = `${environment.apiUrl}CategoryQuestion`;

  constructor(private http: HttpClient) { }

  private manejarError(error: HttpErrorResponse) {
    Alerts.showError('No se puede eliminar este registro porque está siendo utilizado.')
    return throwError(() => error );
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