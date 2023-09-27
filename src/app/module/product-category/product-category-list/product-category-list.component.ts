import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActionPopupComponent } from 'src/app/core/action-popup/action-popup.component';
import { PaginationService } from 'src/app/service/pagination.service';
import { environment } from 'src/environments/environment';
import { DataService } from 'src/app/service/data.service';
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe';
import { ProductcategoryService } from 'src/app/service/productcategory.service';

@AutoUnsubscribe()
@Component({
  selector: 'app-product-category-list',
  templateUrl: './product-category-list.component.html',
  styleUrls: ['./product-category-list.component.scss'],
})
export class ProductCategoryListComponent implements OnInit {
  filterColumns: string[] = ['Name', 'City', 'Country'];
  loadingState = true;
  objectArray: Array<any> = [];
  productlist: Array<any> = [];
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
    private productService: ProductcategoryService,
    public dialog: MatDialog,
    private dataService: DataService
  ) {
    this.dataService.currentUser.subscribe((user) => {
      if (user) this.currentUser = user;
    });
    this.dataService.permission.subscribe((response) => {
      this.permissionObject = response?.permissions?.CATEGORY;
    });
  }

  ngOnInit() {
    this.getProductList();
  }

  getProductList() {
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
    this.productService.getProductcategoryList(params).subscribe(
      (response) => {
        this.loadingState = false;
        if (response?.data?.docs) {
          this.productlist = response?.data?.docs;
          this.pagination = this.paginationService.getPager(
            response?.data['totalDocs'],
            this.currentPage,
            this.currentPageLimit
          );
        } else {
          this.productlist = [];
          this.pagination = null;
        }
      },
      (error) => {
        this.loadingState = false;
        this.productlist = [];
        this.pagination = null;
      }
    );
  }

  getPage(data: any) {
    this.currentPage = data.page;
    this.currentPageLimit = data.limit;
    this.getProductList();
  }

  searchObject(text) {
    this.searchText = text;
    this.currentPage = 1;
   
    this.filters={
      "categoryName": this.searchText,
      "categoryDescription": this.searchText,
    }

    this.searchFilter =  this.filters;
    this.getProductList();
  }

  sortData(name) {
    this.isShort = !this.isShort;
    this.sortFieldName = name;
    this.getProductList();
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
        this.productService.deleteProductcategory(result._id).subscribe(
          (res) => {
            if (res.status == 'success') {
              this.getProductList();
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
