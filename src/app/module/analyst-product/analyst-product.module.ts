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
import { AnalystProductListComponent } from './analyst-product-list/analyst-product-list.component';
import { AnalystProductAddComponent } from './analyst-product-add/analyst-product-add.component';


const routes: Routes = [
  {
    path: "",
    component: AnalystProductListComponent,
    data: { title: 'Analyst Product list' }
  },
  {
    path: "add",
    component: AnalystProductAddComponent,
    data: { title: 'Add Analyst Product' }
  },
  {
    path: 'edit/:id',
    component: AnalystProductAddComponent,
    data: { title: 'Update Analyst Product' }
  }
]



@NgModule({
  declarations: [AnalystProductAddComponent,AnalystProductListComponent],
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
export class AnalystProductModule { }
