import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActionPopupComponent } from 'src/app/core/action-popup/action-popup.component';
import { PaginationService } from 'src/app/service/pagination.service';
import { environment } from 'src/environments/environment';
import { DataService } from 'src/app/service/data.service';
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe';
import { SalesOrderService } from 'src/app/service/sales-order.service';

@AutoUnsubscribe()

@Component({
  selector: 'app-sales-order-list',
  templateUrl: './sales-order-list.component.html',
  styleUrls: ['./sales-order-list.component.scss']
})
export class SalesOrderListComponent implements OnInit {

  filterColumns: string[] = ['Name', 'City', 'Country'];
  loadingState = true;
  objectArray: Array<any> = [];
  salesList: Array<any> = [];
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
  constructor(
    private paginationService: PaginationService,
    private salesOrderService: SalesOrderService,
    public dialog: MatDialog,
    private dataService: DataService
  ) {
    this.dataService.currentUser.subscribe((user) => {
      if (user) this.currentUser = user;
    });
    this.dataService.permission.subscribe((response) => {
     this.permissionObject = response?.permissions?.SALESORDER;
    });
  }

  ngOnInit() {
    this.getSalesList();
  }

  getSalesList() {
    const params: any = {
      page: this.currentPage,
      limit: this.currentPageLimit,
    };

    if (this.sortFieldName) {
      params.sort = this.isShort ? this.sortFieldName : `-${this.sortFieldName}`
     // params.sort = this.isShort ? this.sortFieldName : '-'+this.sortFieldName
    }
    if (this.searchText) {
      params.searchFilter = this.searchFilter;
    }
    this.salesOrderService.getSalesOrderList(params).subscribe(
      (response) => {
        this.loadingState = false;
        if (response?.data?.docs) {
          this.salesList = response?.data?.docs;
          this.showPagination = true;
          this.pagination = this.paginationService.getPager(
            response?.data['totalDocs'],
            this.currentPage,
            this.currentPageLimit
          );
        } else {
          this.salesList = [];
          this.pagination = null;
        }
      },
      (error) => {
        this.loadingState = false;
        this.salesList = [];
        this.pagination = null;
      }
    );
  }

  getPage(data: any) {
    this.currentPage = data.page;
    this.currentPageLimit = data.limit;
    this.getSalesList();
  }

  searchObject(text) {
    this.searchText = text;
    this.currentPage = 1;
   
    this.filters={
      "name": this.searchText,
    }

    this.searchFilter =  this.filters;
    this.getSalesList();
  }

  sortData(name) {
    // Frontend Short
    // this.commonService.isShort = !this.commonService.isShort
    // this.objectArray = this.commonService.sortData(name, this.objectArray);

    // Backend Short
    this.isShort = !this.isShort;
    this.sortFieldName = name;
    this.getSalesList();
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
        this.salesOrderService.deleteAddress(result._id).subscribe(
          (res) => {
            if (res.status) {
              this.getSalesList();
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
