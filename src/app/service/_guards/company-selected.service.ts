import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class IsCompanySelected implements CanActivate  {

  constructor(private router: Router) {}

  canActivate(): boolean {
    if (localStorage.getItem('__ecom__cmp')) {
      return true;
    } else {
      this.router.navigateByUrl('/company');
      return false;
    }
  }
}
