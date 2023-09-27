import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActionPopupComponent } from 'src/app/core/action-popup/action-popup.component';
import { PaginationService } from 'src/app/service/pagination.service';
import { environment } from 'src/environments/environment';
import { DataService } from 'src/app/service/data.service';
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe';
import { AnalystProductService } from 'src/app/service/analyst-product.service';

@AutoUnsubscribe()

@Component({
  selector: 'app-procurmenet-analyst-product-list',
  templateUrl: './procurmenet-analyst-product-list.component.html',
  styleUrls: ['./procurmenet-analyst-product-list.component.scss']
})
export class ProcurmenetAnalystProductListComponent implements OnInit {

  filterColumns: string[] = ['Name', 'City', 'Country'];
  loadingState = true;
  objectArray: Array<any> = [];
  analystList: Array<any> = [];
  pagination: any = null;
  searchText: any = null;
  currentPage: any = 1;
  currentPageLimit = environment.defaultPageLimit;
  permissionObject: any = null;
  showPagination: boolean = false;
  searchFilter: any = {};
  currentUser: any;
  isShort: any = false;
  sortFieldName: any;
  filters:any;
  imageapi = environment.APIEndpoint+'public/';
  constructor(
    private paginationService: PaginationService,
    private analystService: AnalystProductService,
    public dialog: MatDialog,
    private dataService: DataService
  ) {
    this.dataService.currentUser.subscribe((user) => {
      if (user) this.currentUser = user;
    });
    this.dataService.permission.subscribe((response) => {
      this.permissionObject = response?.permissions?.ANALYSTPRODUCT;
    });
  }

  ngOnInit() {
    this.getAnalystList();
  }

  getAnalystList() {
    const params: any = {
      page: this.currentPage,
      limit: this.currentPageLimit,
    };

    if (this.sortFieldName) {
      params.sort = this.isShort ? this.sortFieldName : `-${this.sortFieldName}`
     // params.sort = this.isShort ? this.sortFieldName : '-'+this.sortFieldName
    }
    if (this.searchText) {
      params.searchFilter = JSON.stringify(this.searchFilter);
    }
    this.analystService.getAnalystList(params).subscribe(
      (response) => {
        this.loadingState = false;
        if (response.data?.docs) {
          this.analystList = response?.data?.docs;
          this.showPagination = true;
          this.pagination = this.paginationService.getPager(
            response?.data['totalDocs'],
            this.currentPage,
            this.currentPageLimit
          );
        } else {
          this.objectArray = [];
          this.pagination = null;
        }
      },
      (error) => {
        this.loadingState = false;
        this.objectArray = [];
        this.pagination = null;
      }
    );
  }

  getPage(data: any) {
    this.currentPage = data.page;
    this.currentPageLimit = data.limit;
    this.getAnalystList();
  }

  searchObject(text) {
    this.searchText = text;
    this.currentPage = 1;
   
    this.filters={
      "name": this.searchText,
      "description": this.searchText,
    }

    this.searchFilter =  this.filters;
    this.getAnalystList();
  }
  // searchObject(text) {
  //   this.searchText = text;
  //   this.currentPage = 1;
  //   let filters = [];
  //   for (let index = 0; index < this.filterColumns.length; index++) {
  //     const element = this.filterColumns[index];
  //     filters.push({
  //       propertyName: element,
  //       value: this.searchText,
  //       caseSensitive: true,
  //       operator: 5,
  //     });
  //   }
  //   this.searchFilter = { conditionOperator: 1, filters: filters };
  //   this.getAnalystList();
  // }

  sortData(name) {
    this.isShort = !this.isShort;
    this.sortFieldName = name;
    this.getAnalystList();
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
        this.analystService.deleteAnalyst(result?._id).subscribe(
          (res) => {
            if (res?.status) {
              this.getAnalystList();
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

  ngOnDestroy(): void {}

}
