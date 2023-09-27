import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActionPopupComponent } from 'src/app/core/action-popup/action-popup.component';
import { PaginationService } from 'src/app/service/pagination.service';
import { environment } from 'src/environments/environment';
import { DataService } from 'src/app/service/data.service';
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe';
import { ProductService } from 'src/app/service/product.service';

@AutoUnsubscribe()

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss']
})
export class ProductListComponent implements OnInit {


  filterColumns: string[] = ['Name', 'City', 'Country'];
  loadingState = true;
  objectArray: Array<any> = [];
  productList: Array<any> = [];
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
  imageapi = environment.APIEndpoint+'public/';
  filters:any;
  constructor(
    private paginationService: PaginationService,
    private productService: ProductService,
    public dialog: MatDialog,
    private dataService: DataService
  ) {
    this.dataService.currentUser.subscribe((user) => {
      if (user) this.currentUser = user;
    });
    this.dataService.permission.subscribe((response) => {
      this.permissionObject = response?.permissions?.PRODUCT;
    });
  }

  ngOnInit() {
    this.getProducts();
  }

  getProducts() {
    const params: any = {
      page: this.currentPage,
      limit: this.currentPageLimit,
    };
    if (this.searchText) {
      params.searchFilter = JSON.stringify(this.searchFilter);
    }
    if (this.sortFieldName) {
      params.sort = this.isShort ? this.sortFieldName : `-${this.sortFieldName}`
     // params.sort = this.isShort ? this.sortFieldName : '-'+this.sortFieldName
    }
    this.productService.getProductList(params).subscribe(
      (response) => {
        this.loadingState = false;
        if (response.data) {
          this.productList = response?.data?.docs;
          this.showPagination = true;
          this.pagination = this.paginationService.getPager(
            response.data['totalDocs'],
            this.currentPage,
            this.currentPageLimit
          );
        } else {
          this.productList = [];
          this.pagination = null;
        }
      },
      (error) => {
        this.loadingState = false;
        this.productList = [];
        this.pagination = null;
      }
    );
  }

  getPage(data: any) {
    this.currentPage = data.page;
    this.currentPageLimit = data.limit;
    this.getProducts();
  }

  searchObject(text) {
    this.searchText = text;
    this.currentPage = 1;
   
    this.filters={
      "productName": this.searchText,
      "productDescription": this.searchText,
    }

    this.searchFilter =  this.filters;
    this.getProducts();
  }

  sortData(name) {
    this.isShort = !this.isShort;
    this.sortFieldName = name;
    this.getProducts();
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
        this.productService.deleteProduct(result._id).subscribe(
          (res) => {
            if (res.status == 'success') {
              this.getProducts();
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
