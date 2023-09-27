import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TaskManagementService {

  API_URL: string = environment.APIEndpoint;

  constructor(
    private http: HttpClient,
  ) { }

  getTaskManagementList(param): Observable<any> {
    return this.http.get(`${this.API_URL}task-management`, { params: param });
  }

  TaskManagementList(pagination): Observable<any> {
    return this.http.get(`${this.API_URL}task-management?pagination=${pagination}`);
  }

  saveTaskManagement(data): Observable<any> {
    return this.http.post(`${this.API_URL}task-management`, data);
  }

  GetTaskManagementById(id): Observable<any> {
    return this.http.get(`${this.API_URL}task-management/${id}`);
  }

  updateTaskManagementById(data,id): Observable<any> {
    return this.http.patch(`${this.API_URL}task-management/${id}`, data);
  }

  deleteAddress(id): Observable<any> {
    return this.http.delete(`${this.API_URL}task-management/${id}`);
  }
}
