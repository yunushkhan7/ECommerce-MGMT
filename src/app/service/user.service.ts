import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  API_URL: string = environment.APIEndpoint;

  constructor(
    private http: HttpClient,
  ) { }

  getUserList(param): Observable<any> {
    return this.http.get(`${this.API_URL}user`, {params:param});
  }
  getAllUserList(): Observable<any> {
    return this.http.get(`${this.API_URL}user?pagination=false`);
  }
  saveUser(data): Observable<any> {
    return this.http.post(`${this.API_URL}user`, data);
  }

  updateUser(data,id): Observable<any> {
    return this.http.patch(`${this.API_URL}user/${id}`, data);
}

deleteUser(id): Observable<any> {
  return this.http.delete(`${this.API_URL}user/${id}`);
}
  fileUpload(data,param): Observable<any> {
    return this.http.post(`${this.API_URL}BulkUpload`, data,{params:param});
  }

  getUserById(id): Observable<any> {
    return this.http.get(`${this.API_URL}user/${id}`);
  }

  resetPassword(data,token): Observable<any> {
    return this.http.post(`${this.API_URL}auth/reset-password/${token}`, data);
  }

  updatePassword(data): Observable<any> {
    return this.http.post(`${this.API_URL}ChangePassword`, {}, { params: data });
  }

  changePassword(data): Observable<any> {
    return this.http.post(`${environment.APIEndpoint}v1/Auth/UpdatePassword`, {}, { params: data });
  }

  getMasterData(): Observable<any> {
    return this.http.get(`${this.API_URL}/user/master-data`);
  }

  checkLoginIdExists(param = null): Observable<any> {
    return this.http.get(`${this.API_URL}CheckLoginIdExists`, { params: param });
  }


  

}
