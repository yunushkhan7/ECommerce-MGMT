import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CompanyService {

  API_URL: string = environment.APIEndpoint;

  constructor(
    private http: HttpClient,
  ) { }

  saveCompany(data): Observable<any> {
    return this.http.post(`${this.API_URL}company`, data);
  }

  getCompanyList(param): Observable<any> {
    return this.http.get(`${this.API_URL}company`, { params: param });
  }
  companyList(pagination): Observable<any> {
    return this.http.get(`${this.API_URL}company?pagination=${pagination}`);
  }

  companyUpdateById(id, data): Observable<any> {
    return this.http.patch(`${this.API_URL}company/${id}`, data);
  }
  getCompanyById(id): Observable<any> {
    return this.http.get(`${this.API_URL}company/${id}`);
  }

  deleteCompany(id): Observable<any> {
    return this.http.delete(`${this.API_URL}company/${id}`);
  }
}
