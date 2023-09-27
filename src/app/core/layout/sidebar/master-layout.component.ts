import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { environment } from 'src/environments/environment';
import * as $ from 'jquery';
import { DataService } from 'src/app/service/data.service';
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe';

@AutoUnsubscribe()
@Component({
  selector: 'app-master-layout',
  templateUrl: './master-layout.component.html',
  styleUrls: ['./master-layout.component.scss']
})
export class MasterLayoutComponent implements OnInit {

  subNavShow: boolean = false;
  brandTitle = "NEC"
  navLink: any = [];
  sidenavShow: boolean;
  activeLang: string;
  languageList = environment.language;

  isCompanySelected: boolean = false;
  currentUser: any;

  constructor(
    public translate: TranslateService,
    private dataService: DataService
  ) {

    if (localStorage.getItem('currentLanguage')) {
      (translate.getLangs().includes(localStorage.getItem('currentLanguage')) ?
        this.activeLang = localStorage.getItem('currentLanguage') :
        this.activeLang = environment?.defaultLangCode
      )
    }
    else this.activeLang = environment.defaultLangCode;
    this.dataService.currentUser.subscribe((res) => {
      if (res) {
        this.currentUser = res;
      }
    });
  }

  ngOnInit() {
    this.activeLang = this.translate.currentLang;
    this.sidenavShow = true;
  }
  searchObject(a) {
  }

  onLanguageChange(): void {
    localStorage.setItem('currentLanguage', this.activeLang);
    window.location.reload();
  }
  showSidebarMob() {
    // this.sidenavShow = !this.sidenavShow;
    if ($('.sideNav').css('width') == '0px') {
      $('.sideNav').css('width', '210px');
      $('.overlay').css('display', 'block');
    }
    else {
      $('.sideNav').css('width', '0px');
      $('.overlay').css('display', 'none');
    }
  }
  ngOnDestroy(): void { }
}
