import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProductcategoryService {

  API_URL: string = environment.APIEndpoint;

  constructor(
    private http: HttpClient,
  ) { }

  saveProductcategory(data): Observable<any> {
    return this.http.post(`${this.API_URL}category`, data);
  }

  getProductcategoryList(param): Observable<any> {
    return this.http.get(`${this.API_URL}category`, { params: param });
  }

  ProductcategoryList(pagination): Observable<any> {
    return this.http.get(`${this.API_URL}category?pagination=${pagination}`);
  }

  GetProductcategoryById(id): Observable<any> {
    return this.http.get(`${this.API_URL}category/${id}`);
  }

  ProductcategoryUpdate(id, data): Observable<any> {
    return this.http.patch(`${this.API_URL}category/${id}`, data);
  }

  deleteProductcategory(id): Observable<any> {
    return this.http.delete(`${this.API_URL}category/${id}`);
  }
}
