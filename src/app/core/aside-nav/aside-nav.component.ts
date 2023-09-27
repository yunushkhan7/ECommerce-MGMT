import { Component, OnInit, Input } from '@angular/core';
import * as $ from 'jquery';
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe';
import { DataService } from 'src/app/service/data.service';
@AutoUnsubscribe()
@Component({
  selector: 'app-aside-nav',
  templateUrl: './aside-nav.component.html',
  styleUrls: ['./aside-nav.component.scss'],
})
export class AsideNavComponent implements OnInit {

  isShown: boolean;
  isShown2: boolean;

  isAdmin: boolean;
  isCompany: boolean;
  isProcurement: boolean;
  isInventory: boolean;
  isMarketingSales: boolean;
  isDispatch: boolean;

  sidenavshow: boolean;
  sidenavShow: boolean;
  currentUser: any;
  permissionObject: any = null;
  currentCompany: any;
  isCompanySelected: boolean;

  constructor(private dataService: DataService) {
    this.dataService.currentUser.subscribe((response) => {
      this.currentUser = response;
    });
    this.dataService.permission.subscribe((response) => {
      this.permissionObject = response;
    });
    this.dataService.currentCompany.subscribe((response) => {
      this.currentCompany = response;
    });
    this.dataService.isCompanySelected.subscribe((response) => {
      this.isCompanySelected = response;
    });
  }

  ngOnInit() {
    this.isShown = true;
    this.isShown2 = true;
    this.sidenavShow = true;
  }
  toggleAdmin() {
    this.isAdmin = !this.isAdmin;
  }

  toggleCompany() {
    this.isCompany = !this.isCompany;
  }

  toggleProcurement() {
    this.isProcurement = !this.isProcurement;
  }

  toggleInventory() {
    this.isInventory = !this.isInventory;
  }

  toggleMarketingSales() {
    this.isMarketingSales = !this.isMarketingSales;
  }

  toggleDispatch() {
    this.isDispatch = !this.isDispatch;
  }





  toggleShowSideBar() {
    this.sidenavshow = !this.sidenavshow;
    if (!this.sidenavshow) {
      $('.sideNav').css('width', '82px');
      // $('.side-container').css('margin-left', '82px').slideLeft();
      $('.side-container').addClass('wl_82');
    }
    else {
      $('.sideNav').css('width', '210px');
      // $('.side-container').css('margin-left', '210px');
      $('.side-container').removeClass('wl_82');

    }
  }

  showSidebarMob() {
    if (window.innerWidth <= 575) {
      $('.sideNav').css('width', '0');
      $('.side-container').css('margin-left', '0');
      $('.overlay').css('display', 'none');
    }
  }

  ngOnDestroy(): void {
  }
}
