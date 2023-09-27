import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SalesOrderService {

  API_URL: string = environment.APIEndpoint;

  constructor(
    private http: HttpClient,
  ) { }


  saveSalesOrder(data): Observable<any> {
    return this.http.post(`${this.API_URL}sales-order`, data);
  }

  getSalesOrderList(param): Observable<any> {
    return this.http.get(`${this.API_URL}sales-order`, { params: param });
  }

  GetSalesOrderById(id): Observable<any> {
    return this.http.get(`${this.API_URL}sales-order/${id}`);
  }

  updateSalesOrder(id, data): Observable<any> {
    return this.http.patch(`${this.API_URL}sales-order/${id}`, data);
  }

  deleteAddress(id): Observable<any> {
    return this.http.delete(`${this.API_URL}sales-order/${id}`);
  }
}
