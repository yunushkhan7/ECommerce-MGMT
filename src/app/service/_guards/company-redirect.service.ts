import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class CompanyRedirectService implements CanActivate {
  constructor(private router: Router) { }
  canActivate(): boolean {
    if (localStorage.getItem('__ecom__cmp')) {
      this.router.navigateByUrl('/dashboard');
      return false;
    } else {
      return true;
    }
  }
}
