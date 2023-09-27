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
import { ProcurmenetVendorAddComponent } from './procurmenet-vendor-add/procurmenet-vendor-add.component';
import { ProcurmenetVendorListComponent } from './procurmenet-vendor-list/procurmenet-vendor-list.component';


const routes: Routes = [
  {
    path: "",
    component: ProcurmenetVendorListComponent,
    data: { title: 'procurmenet Vendors list' }
  },
  {
    path: "add",
    component: ProcurmenetVendorAddComponent,
    data: { title: 'procurmenet Add Vendors' }
  },
  {
    path: 'edit/:id',
    component: ProcurmenetVendorAddComponent,
    data: { title: 'Update procurmenet Vendors' }
  }
]
@NgModule({
  declarations: [ProcurmenetVendorListComponent,ProcurmenetVendorAddComponent],
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
export class ProcurmenetVendorModule { }
