import { Injectable } from '@angular/core';
import { CanActivate, Router, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import { DataService } from '../data.service';
@Injectable({
  providedIn: 'root'
})

export class EnsureAuthenticated implements CanActivate {
  constructor(
    private router: Router,
    private dataService: DataService) {
  }
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    if (localStorage.getItem('_auth_ecom')) {
      return true;
    }
    this.router.navigate(['/login'], { queryParams: { next: encodeURI(state.url) } });
    return false;
  }
}
