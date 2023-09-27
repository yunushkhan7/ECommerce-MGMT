import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';
import { FormValidationModule } from 'src/app/shared/form-validation/form-validation.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { PaginationModule } from 'src/app/core/pagination/pagination.module';
import { MaterialExModule } from 'src/app/shared/material.module';
import { SearchModule } from 'src/app/core/search/search.module';
import { LoaderModule } from 'src/app/core/loader/loader.module';
import { I18nModule } from 'src/app/shared/i18n/i18n.module';
import { SalesOrderAddComponent } from './sales-order-add/sales-order-add.component';
import { SalesOrderListComponent } from './sales-order-list/sales-order-list.component';


const routes: Routes = [
  {
    path: "",
    component: SalesOrderListComponent,
    data: { title: 'Sales Order list' }
  },
  {
    path: "add",
    component: SalesOrderAddComponent,
    data: { title: 'Add Sales Order' }
  },
  {
    path: 'edit/:id',
    component: SalesOrderAddComponent,
    data: { title: 'Update Sales Order' }
  }
]

@NgModule({
  declarations: [SalesOrderAddComponent, SalesOrderListComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FormsModule,
    ReactiveFormsModule,
    FormValidationModule,
    MaterialExModule,
    SharedModule,
    PaginationModule,
    SearchModule,
    LoaderModule,
    I18nModule
  ]
})
export class SalesOrderModule { }
