import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class JwtService {

  getToken(): string {
    return window.localStorage['_auth_ecom'];
  }

  saveToken(token: string) {
    window.localStorage['_auth_ecom'] = token;
  }

  destroyToken() {
    window.localStorage.removeItem('_auth_ecom');
  }

  getCompanyId(): string {
    return window.localStorage['__ecom__cmp'];
  }

  saveCompanyId(id: any) {
    window.localStorage['__ecom__cmp'] = id;
  }

  destroyCompanyId() {
    window.localStorage.removeItem('__ecom__cmp');
  }

  saveValue(name, value) {
    window.localStorage[name] = value;
  }

  destroyValue(name) {
    window.localStorage.removeItem(name);
  }

  getValue(name): string {
    return window.localStorage[name]; // window.localStorage['google_token'];
  }

  // refreshToken
  getRefreshToken(): string {
    return window.localStorage['refreshToken'];
  }

  saveRefreshToken(token: string) {
    window.localStorage['refreshToken'] = token;
  }

  destroyRefreshToken() {
    window.localStorage.removeItem('refreshToken');
  }
}
