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
import { VendorsSupplierListComponent } from './vendors-supplier-list/vendors-supplier-list.component';
import { VendorsSupplierAddComponent } from './vendors-supplier-add/vendors-supplier-add.component';
const routes: Routes = [
  {
    path: "",
    component: VendorsSupplierListComponent,
    data: { title: 'Vendors list' }
  },
  {
    path: "add",
    component: VendorsSupplierAddComponent,
    data: { title: 'Add Vendors' }
  },
  {
    path: 'edit/:id',
    component: VendorsSupplierAddComponent,
    data: { title: 'Update Vendors' }
  }
]


@NgModule({
  declarations: [VendorsSupplierListComponent,VendorsSupplierAddComponent],
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
export class VendorsSupplierModule { }
