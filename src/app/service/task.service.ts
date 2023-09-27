import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  API_URL: string = environment.APIEndpoint;

  constructor(
    private http: HttpClient,
  ) { }


  saveTask(data): Observable<any> {
    return this.http.post(`${this.API_URL}task`, data);
  }

  getTaskList(param): Observable<any> {
    return this.http.get(`${this.API_URL}task`, { params: param });
  }

  getAllTasList(): Observable<any> {
    return this.http.get(`${this.API_URL}task?pagination=false`);
  }

  GetTaskById(id): Observable<any> {
    return this.http.get(`${this.API_URL}task/${id}`);
  }

  updateTask(id,data): Observable<any> {
    return this.http.patch(`${this.API_URL}task/${id}`, data);
  }

  deleteTask(id): Observable<any> {
    return this.http.delete(`${this.API_URL}task/${id}`);
  }
}
