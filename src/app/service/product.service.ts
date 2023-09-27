import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  API_URL: string = environment.APIEndpoint;

  constructor(
    private http: HttpClient,
  ) { }

  getProductList(param): Observable<any> {
    return this.http.get(`${this.API_URL}product`, { params: param });
  }

  ProductList(pagination): Observable<any> {
    return this.http.get(`${this.API_URL}product?pagination=${pagination}`);
  }

  saveProduct(data): Observable<any> {
    return this.http.post(`${this.API_URL}product`, data);
  }

  GetProductById(id): Observable<any> {
    return this.http.get(`${this.API_URL}product/${id}`);
  }

  ProductUpdate(id, data): Observable<any> {
    return this.http.patch(`${this.API_URL}product/${id}`, data);
  }

  deleteProduct(id): Observable<any> {
    return this.http.delete(`${this.API_URL}product/${id}`);
  }
}
