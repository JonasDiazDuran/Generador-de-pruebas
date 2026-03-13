import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../Environment/Environment';
import { Observable, timeout } from 'rxjs';
import { ServiceResponse } from '../models/types';
import { jwtDecode } from "jwt-decode";
interface JwtPayload {
  sub: string;
  email: string;
  exp: number;
  role?: string;
}
@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(private http: HttpClient) { }
  baseUrl = environment.apiIntranetUrl;
  usuarioLogueado: any;
  token!: any;
  rol : string | undefined = "";


  capitalizeFirstLetter(str: string) {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  }


  login(token: string, idSistema: number): Observable<ServiceResponse> {
    return this.http.post<ServiceResponse>(this.baseUrl + 'User/post/login', { 'token': token, 'IdSistema': idSistema })
  }
  logout(token: string): Observable<ServiceResponse> {
    return this.http.post<ServiceResponse>(this.baseUrl + '/logout', { 'token': token })
  }

  public getRol(token : string)
  {
    token = token.replace(/^"(.*)"$/, '$1')
    const decoded =jwtDecode<JwtPayload>(token);
    return decoded.role;
  }


}
