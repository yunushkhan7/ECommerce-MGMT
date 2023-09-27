import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable()
export class AuthService {

  // API_URL: string = environment.APIEndpoint + 'v1/Authentication/';
  API_URL: string = environment.APIEndpoint;
  API_URL2: string = environment.APIEndpoint + 'v1/Modules/';
  constructor(
    private http: HttpClient,
  ) { }

  login(data): Observable<any> {
    return this.http.post(`${this.API_URL}auth/login`, data);
  }
  // forgotPassword(email): Observable<any> {
  //   return this.http.post(`${environment.APIEndpoint}v1/Auth/sendOTP`, {}, { params: email });
  // }

  forgotPassword(email): Observable<any> {
    return this.http.post(`${this.API_URL}auth/forgot-password`, {"email":email});
  }

  getModules(params): Observable<any> {
    return this.http.post(`${this.API_URL2}GetModules`, params);
  }
  getModulesList(): Observable<any> {
    return this.http.get(`${this.API_URL}module`);
  }
}
