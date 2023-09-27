import { Injectable } from '@angular/core';
import { ReplaySubject, BehaviorSubject } from 'rxjs';
import { JwtService } from './jwt.service';
import { encryptValue } from '../shared/common';
import { CommonService } from './common.service';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  // for checking company is selected or not
  private isCompanySelectedSubject = new BehaviorSubject<boolean>(false);
  public isCompanySelected = this.isCompanySelectedSubject.asObservable();

  // for storing current company details
  private currentCompanySubject = new BehaviorSubject(null);
  public currentCompany = this.currentCompanySubject.asObservable();

  // for storing current user details
  public currentUserSubject = new BehaviorSubject(null);
  public currentUser = this.currentUserSubject.asObservable()

  // for checking user is authneticated or not
  public isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  public isAuthenticated = this.isAuthenticatedSubject.asObservable();

  // for storing common lists details
  private commonListSubject = new BehaviorSubject(null);
  public commonList = this.commonListSubject.asObservable()

  // for storing current user permission details
  public userPermissionSubject = new BehaviorSubject(null);
  public permission = this.userPermissionSubject.asObservable()

  // for storing current company details
  public forgatAuthSubject = new BehaviorSubject(null);
  public forgatAuth = this.forgatAuthSubject.asObservable()
  authUser: any;
  constructor(
    private jwtService: JwtService,
    private commonService: CommonService
  ) { }

  saveToken(token) {
    this.jwtService.saveToken(encryptValue(token));
  }
  saveRefreshToken(token) {
    this.jwtService.saveRefreshToken(encryptValue(token));
  }

  saveCommonList(data) {
    this.commonListSubject.next(data);
  }

  setAuth(data) {
    // this.saveToken(data?.user['token']);
    // this.updateAuth({ ...data?.user });
    // this.updatePermission(data.permissions)
    // if (data.Company && data.Company._id) {
    //   this.updateCompany(data.Company);
    // }

      this.saveToken(data?.data?.user['token']);
      this.authUser = data;
      this.updateAuth({ ...data?.data?.user });
      this.updatePermission(data?.data?.permissions);
       if (data.Company && data.Company._id) {
      this.updateCompany(data.Company);
    }

  }

  updateAuth(data) {
    this.currentUserSubject.next(data);
    this.isAuthenticatedSubject.next(true);
  }

  // updatePermission(data) {
  //   this.userPermissionSubject.next(data);
  // }


  updatePermission(data) {
    let permissionModify = data;
    let permissionObject: any = {};
    permissionModify.forEach((e) => {
      let body: any = {}
      e.operations.forEach((permission: any) => {
        body[String(permission).toLowerCase().trim()] = true;
      });
      permissionObject[e._id] = body;
    });
    this.userPermissionSubject.next({ permissions: permissionObject });
  }
  purgeAuth() {
    this.jwtService.destroyToken();
    this.jwtService.destroyRefreshToken();
    this.isAuthenticatedSubject.next(false);
    this.currentUserSubject.next(null);
    this.userPermissionSubject.next([]);
    this.purgeCompany();
  }

  updateCompany(data) {
    this.currentCompanySubject.next(data);
    this.jwtService.saveCompanyId(data._id);
    this.isCompanySelectedSubject.next(true);
  }

  purgeCompany() {
    this.jwtService.destroyCompanyId();
    this.currentCompanySubject.next(null);
    this.isCompanySelectedSubject.next(false);
  }
}
