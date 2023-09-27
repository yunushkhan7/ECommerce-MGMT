import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DeliveryPartnerService {

  API_URL: string = environment.APIEndpoint;

  constructor(
    private http: HttpClient,
  ) { }

  saveDeliveryPartner(data): Observable<any> {
    return this.http.post(`${this.API_URL}delivery-partner`, data);
  }

  getDeliveryPartnerList(param): Observable<any> {
    return this.http.get(`${this.API_URL}delivery-partner`, { params: param });
  }

  DeliveryPartnerList(pagination): Observable<any> {
    return this.http.get(`${this.API_URL}delivery-partner?pagination=${pagination}`);
  }

  GetDeliveryPartnerById(id): Observable<any> {
    return this.http.get(`${this.API_URL}delivery-partner/${id}`);
  }

  updateDeliveryPartner(data,id): Observable<any> {
    return this.http.patch(`${this.API_URL}delivery-partner/${id}`,data);
  }

  deleteAddress(id): Observable<any> {
    return this.http.delete(`${this.API_URL}delivery-partner/${id}`);
  }
}
