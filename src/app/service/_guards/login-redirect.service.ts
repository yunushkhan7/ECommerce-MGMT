import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})

export class LoginRedirect implements CanActivate {
  constructor(private router: Router) { }
  canActivate(): boolean {
    if (localStorage.getItem('_auth_ecom')) {
      return false;
    } else {
      return true;
    }
  }
}
