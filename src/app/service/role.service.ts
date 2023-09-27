import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RoleService {

  API_URL: string = environment.APIEndpoint;

  constructor(
    private http: HttpClient,
  ) { }

  RoleList(param): Observable<any> {
    return this.http.get(`${this.API_URL}role`,  { params: param });
  }
  getRoleList(pagination,page,limit): Observable<any> {
    if(pagination){
      return this.http.get(`${this.API_URL}role?page=${page}&limit=${limit}`);
    }else{
      return this.http.get(`${this.API_URL}role?pagination=${pagination}`);
    }
  }

  saveRole(data): Observable<any> {
    return this.http.post(`${this.API_URL}role`, data);
  }

  deleteRole(id)
: Observable<any> {
    return this.http.delete(`${this.API_URL}role/${id}`);
  }

  getRoleById(id)
: Observable<any> {
    return this.http.get(`${this.API_URL}role/${id}`);
  }

  roleUpdate(id, data): Observable<any> {
    return this.http.patch(`${this.API_URL}role/${id}`, data);
  }


}
