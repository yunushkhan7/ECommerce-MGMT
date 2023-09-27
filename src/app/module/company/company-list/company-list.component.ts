import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActionPopupComponent } from 'src/app/core/action-popup/action-popup.component';
import { PaginationService } from 'src/app/service/pagination.service';
import { environment } from 'src/environments/environment';
import { DataService } from 'src/app/service/data.service';
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe';
import { CompanyService } from 'src/app/service/company.service';
import { Router } from '@angular/router';

@AutoUnsubscribe()
@Component({
  selector: 'app-company-list',
  templateUrl: './company-list.component.html',
  styleUrls: ['./company-list.component.scss'],
})
export class CompanyListComponent implements OnInit {
  filterColumns: string[] = ['Name', 'City', 'Country'];
  loadingState = true;
  objectArray: Array<any> = [];
  companyList: Array<any> = [];
  pagination: any = null;
  searchText: any = null;
  currentPage: any = 1;
  currentPageLimit = environment.defaultPageLimit;
  permissionObject: any = null;
  showPagination: boolean = false;
  searchFilter: any = {};
  currentHotel: any;
  isShort: any = false;
  sortFieldName: any;
  currentUser: any;
  filters:any;
  constructor(
    private paginationService: PaginationService,
    private companyService: CompanyService,
    public dialog: MatDialog,
    private dataService: DataService,
    private router: Router,
  ) {
    this.dataService.currentUser.subscribe((user) => {
      if (user) this.currentUser = user;
    });
    this.dataService.permission.subscribe((response) => {
      this.permissionObject = response?.permissions?.COMPANY;
    });
  }

  ngOnInit() {
    this.getCompanyList();
  }
  getCompanyList() {
    const params: any = {
      page: this.currentPage,
      limit: this.currentPageLimit
    };
    if (this.searchText) {
      params.searchFilter = JSON.stringify(this.searchFilter);
    }
    if (this.sortFieldName) {
      params.sort = this.isShort ? this.sortFieldName : `-${this.sortFieldName}`
     // params.sort = this.isShort ? this.sortFieldName : '-'+this.sortFieldName
    }
    this.companyService.getCompanyList(params).subscribe(
      (response) => {
        this.loadingState = false;
        if (response.data) {
          this.companyList = response?.data?.docs;
          this.showPagination = true;
          this.pagination = this.paginationService.getPager(
            response?.data['totalDocs'],
            this.currentPage,
            this.currentPageLimit
          );
        } else {
          this.companyList = [];
          this.pagination = null;
        }
      },
      (error) => {
        this.loadingState = false;
        this.companyList = [];
        this.pagination = null;
      }
    );
  }

  getPage(data: any) {
    this.currentPage = data.page;
    this.currentPageLimit = data.limit;
    this.getCompanyList();
  }

  searchObject(text) {
    this.searchText = text;
    this.currentPage = 1;

    this.filters={
      "name": this.searchText,
      "companyEmail": this.searchText,
      // "companyDomain" : this.searchText,
      // "companySubdomain" : this.searchText,
      // "langauage" : this.searchText,
      // "country" : this.searchText,
      // "state" : this.searchText,
      // "city" : this.searchText,
      // "streetAddress" : this.searchText,
    }

    this.searchFilter =  this.filters;
    this.getCompanyList();
  }

  sortData(name) {
    this.isShort = !this.isShort;
    this.sortFieldName = name;
    this.getCompanyList();
  }

  onDelete(data: any): void {
    const dialogRef = this.dialog.open(ActionPopupComponent, {
      width: '683px',
      height: '554px',
      data: { ...data, isDelete: true },
      panelClass: 'delete-popup',
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result && result.is_delete) {
        this.companyService.deleteCompany(data?._id).subscribe(
          (res) => {
            if (res.status == 'success') {
              this.getCompanyList();
              this.dialog.open(ActionPopupComponent, {
                data: { ...res, isSuccess: true },
              });
            } else {
              this.dialog.open(ActionPopupComponent, {
                data: { ...res, isSuccess: true },
              });
            }
          },
          (err) => {
            this.dialog.open(ActionPopupComponent, {
              data: { ...err.error, isSuccess: true },
            });
          }
        );
      }
    });
  }

  onCompanySelect(obj) {
    this.companyService.getCompanyById(obj._id).subscribe((response) => {
      if (response.success) {
        this.dataService.updateCompany(response.data);
        this.router.navigateByUrl('/dashboard');
      } else {

      }
    });
  }

  ngOnDestroy(): void { }
}
