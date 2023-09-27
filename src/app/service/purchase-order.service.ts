import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PurchaseOrderService {

  API_URL: string = environment.APIEndpoint;

  constructor(
    private http: HttpClient,
  ) { }

  savePurchaseOrder(data): Observable<any> {
    return this.http.post(`${this.API_URL}purchase-order`, data);
  }

  getPurchaseOrderList(param): Observable<any> {
    return this.http.get(`${this.API_URL}purchase-order`, { params: param });
  }

  GetPurchaseOrderById(id): Observable<any> {
    return this.http.get(`${this.API_URL}purchase-order/${id}`);
  }

  PurchaseOrderUpdate(id, data): Observable<any> {
    return this.http.patch(`${this.API_URL}purchase-order/${id}`, data);
  }

  deleteAddress(id): Observable<any> {
    return this.http.delete(`${this.API_URL}purchase-order/${id}`);
  }
}
