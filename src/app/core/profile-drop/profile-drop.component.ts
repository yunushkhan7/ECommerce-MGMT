import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/service/data.service';
import { Router } from '@angular/router';
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe';
@AutoUnsubscribe()
@Component({
  selector: 'app-profile-drop',
  templateUrl: './profile-drop.component.html',
  styleUrls: ['./profile-drop.component.scss']
})
export class ProfileDropComponent implements OnInit {

  isAuthenticated: boolean;
  isCompanySelected: boolean;

  currentUserDetail: any;
  permission: any = [];
  permissionObject: any = null;

  constructor(
    private router: Router,
    private dataService: DataService,
  ) {

    this.dataService.currentUser.subscribe((response) => {
      this.currentUserDetail = response;
    });

    this.dataService.isCompanySelected.subscribe((response) => {
      this.isCompanySelected = response;
    });

  }

  ngOnInit() { }

  onLogOut() {
    this.dataService.purgeAuth();
    this.router.navigateByUrl('/login');
  }

  removeCompany() {
    this.dataService.purgeCompany();
    this.router.navigateByUrl('/company');
  }

  ngOnDestroy(): void { }
}
