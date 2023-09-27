import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActionPopupComponent } from 'src/app/core/action-popup/action-popup.component';
import { PaginationService } from 'src/app/service/pagination.service';
import { environment } from 'src/environments/environment';
import { DataService } from 'src/app/service/data.service';
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe';
import { RoleService } from 'src/app/service/role.service';

@AutoUnsubscribe()
@Component({
  selector: 'app-role-list',
  templateUrl: './role-list.component.html',
  styleUrls: ['./role-list.component.scss']
})
export class RoleListComponent implements OnInit {

  filterColumns: string[] = ['Name', 'City', 'Country'];
  loadingState = true;
  objectArray: Array<any> = [];
  rolList: Array<any> = [];
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
    private roleService: RoleService,
    public dialog: MatDialog,
    private dataService: DataService
  ) {
    this.dataService.currentUser.subscribe((user) => { if (user) this.currentUser = user; });
    this.dataService.permission.subscribe((response) => {
      this.permissionObject = response?.permissions?.ROLE;
    });
  }

  ngOnInit() {
    this.getObjects();
  }

  getObjects() {
    const params: any = {
      page: this.currentPage,
      limit: this.currentPageLimit
    };

    if (this.sortFieldName) {
      params.sort = this.isShort ? this.sortFieldName : `-${this.sortFieldName}`
     // params.sort = this.isShort ? this.sortFieldName : '-'+this.sortFieldName
    }
    if (this.searchText) {
      params.searchFilter = JSON.stringify(this.searchFilter);
    }
    this.roleService.RoleList(params).subscribe((response) => {
      this.loadingState = false;
      if (response?.data?.docs) {
        this.rolList=response?.data?.docs;
        this.showPagination = true;
        this.pagination = this.paginationService.getPager(
          response.data['totalDocs'],
          this.currentPage,
          this.currentPageLimit
        );
      } else {
        this.rolList = [];
        this.pagination = null;
      }
    }, (error) => {
      this.loadingState = false;
      this.rolList = [];
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
      "name": this.searchText,
      "description": this.searchText,
    }

    this.searchFilter =  this.filters;
    this.getObjects();
  }

  sortData(name) {
    // Frontend Short
    // this.commonService.isShort = !this.commonService.isShort
    // this.objectArray = this.commonService.sortData(name, this.objectArray);

    // Backend Short
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
        this.roleService.deleteRole(data?._id).subscribe((res) => {
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
