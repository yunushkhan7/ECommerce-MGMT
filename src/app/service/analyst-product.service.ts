import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AnalystProductService {

  API_URL: string = environment.APIEndpoint;

  constructor(
    private http: HttpClient,
  ) { }

  getAnalystList(param): Observable<any> {
    return this.http.get(`${this.API_URL}analyst-product`, { params: param });
  }
  AnalystUpdate(id, data): Observable<any> {
    return this.http.patch(`${this.API_URL}analyst-product/${id}`, data);
  }
  saveAnalystProduct(data): Observable<any> {
    return this.http.post(`${this.API_URL}analyst-product`, data);
  }

  GetAnalystById(id): Observable<any> {
    return this.http.get(`${this.API_URL}analyst-product/${id}`);
  }

  deleteAnalyst(id): Observable<any> {
    return this.http.delete(`${this.API_URL}analyst-product/${id}`);
  }

}
