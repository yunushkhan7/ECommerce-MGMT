import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MarketingService {

  API_URL: string = environment.APIEndpoint;

  constructor(
    private http: HttpClient,
  ) { }

  saveMarketing(data): Observable<any> {
    return this.http.post(`${this.API_URL}marketing`, data);
  }

  getMarketingList(param): Observable<any> {
    return this.http.get(`${this.API_URL}marketing`, { params: param });
  }

  GetMarketingById(id): Observable<any> {
    return this.http.get(`${this.API_URL}marketing/${id}`);
  }

  updateMarketing(id, data): Observable<any> {
    return this.http.patch(`${this.API_URL}marketing/${id}`, data);
  }

  deleteMarket(id): Observable<any> {
    return this.http.delete(`${this.API_URL}marketing/${id}`);
  }
}
