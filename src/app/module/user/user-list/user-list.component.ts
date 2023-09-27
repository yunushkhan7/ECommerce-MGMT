import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActionPopupComponent } from 'src/app/core/action-popup/action-popup.component';
import { PaginationService } from 'src/app/service/pagination.service';
import { environment } from 'src/environments/environment';
import { DataService } from 'src/app/service/data.service';
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe';
import { UserService } from 'src/app/service/user.service';

@AutoUnsubscribe()
@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent implements OnInit {

  filterColumns: string[] = ['firstName', 'lastName', 'email', 'username'];
  loadingState = true;
  objectArray: Array<any> = [];
  pagination: any = null;
  searchText: any = null;
  currentPage: any = 1;
  currentPageLimit = environment.defaultPageLimit;
  permissionObject: any = null;
  showPagination: boolean = false;
  userList:any=[]
  searchFilter: any = {};
  currentUser: any;
  isShort: any = false;
  sortFieldName: any;
  filters:any;
  imageapi = environment.APIEndpoint+'public/';

  constructor(
    private paginationService: PaginationService,
    private userService: UserService,
    public dialog: MatDialog,
    private dataService: DataService
  ) {
    this.dataService.currentUser.subscribe((user) => { if (user) this.currentUser = user; });
    this.dataService.permission.subscribe((response) => {
      this.permissionObject = response?.permissions?.USER;
    });
  }

  ngOnInit() {
    this.getObjects();
  }

  getObjects() {
    const params: any = {
      page: this.currentPage,
      limit: this.currentPageLimit,
      // sort : this.isShort ? this.sortFieldName : -this.sortFieldName
    };
    if (this.searchText) {
      params.searchFilter = JSON.stringify(this.searchFilter);
    }
    if (this.sortFieldName) {
       params.sort = this.isShort ? this.sortFieldName : `-${this.sortFieldName}`
      // params.sort = this.isShort ? this.sortFieldName : '-'+this.sortFieldName
    }

    this.userService.getUserList(params).subscribe((response) => {
      this.loadingState = false;
      if (response.data) {
        this.objectArray = response.data;
        this.userList=response?.data?.docs
        this.showPagination = true;
       // this.pagination = this.paginationService.getPager(response['recordCount'], this.currentPage, this.currentPageLimit);

       this.pagination = this.paginationService.getPager(
        response.data['totalDocs'],
        this.currentPage,
        this.currentPageLimit
      );
      } else {
        this.objectArray = [];
        this.pagination = null;
      }
    }, (error) => {
      this.loadingState = false;
      this.objectArray = [];
      this.pagination = null;
    });
  }

  getPage(data: any) {
    this.currentPage = data.page;
    this.currentPageLimit = data.limit;
    this.getObjects();
  }

  searchObject(text) {
    this.searchText = text;
    this.currentPage = 1;
   
    this.filters={
      "firstName": this.searchText,
      "username": this.searchText,
      "lastName" : this.searchText,
      "email" : this.searchText
    }

    this.searchFilter =  this.filters;
    this.getObjects();
  }
  searchData(){

  }
  sortData(name) {
    this.isShort = !this.isShort;
    this.sortFieldName = name;
    this.getObjects();
  }

  onDelete(data: any): void {
    const dialogRef = this.dialog.open(ActionPopupComponent, {
      width: '683px',
      height: '554px',
      data: { ...data, isDelete: true },
      panelClass: 'delete-popup'
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result && result.is_delete) {
        this.userService.deleteUser(result?._id).subscribe((res) => {
          if (res.status) {
            this.getObjects();
            this.dialog.open(ActionPopupComponent, {
              data: { ...res, isSuccess: true }
            });
          }
          else {
            this.dialog.open(ActionPopupComponent, {
              data: { ...res, isSuccess: true }
            });
          }
        }, (err) => {
          this.dialog.open(ActionPopupComponent, {
            data: { ...err.error, isSuccess: true }
          });
        })
      }
    });
  }

  ngOnDestroy(): void { }
}
