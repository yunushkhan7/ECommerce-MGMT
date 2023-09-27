import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class VendorsSupplierService {

  API_URL: string = environment.APIEndpoint;

  constructor(
    private http: HttpClient,
  ) { }

  saveVendors(data): Observable<any> {
    return this.http.post(`${this.API_URL}vendor`, data);
  }
  getVendorsList(param): Observable<any> {
    return this.http.get(`${this.API_URL}vendor`, { params: param });
  }

  VendorsList(pagination): Observable<any> {
    return this.http.get(`${this.API_URL}vendor?pagination=${pagination}`);
  }

  GetVendorsById(id): Observable<any> {
    return this.http.get(`${this.API_URL}vendor/${id}`, {});
  }

  updateVender(data,id): Observable<any> {
      return this.http.patch(`${this.API_URL}vendor/${id}`, data);
  }

  deleteAddress(id): Observable<any> {
    return this.http.delete(`${this.API_URL}vendor/${id}`);
  }
}
