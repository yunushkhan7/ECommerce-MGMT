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
import { ProcurmenetAnalystProductAddComponent } from './procurmenet-analyst-product-add/procurmenet-analyst-product-add.component';
import { ProcurmenetAnalystProductListComponent } from './procurmenet-analyst-product-list/procurmenet-analyst-product-list.component';


const routes: Routes = [
  {
    path: "",
    component: ProcurmenetAnalystProductListComponent,
    data: { title: 'Analyst Product list' }
  },
  {
    path: "add",
    component: ProcurmenetAnalystProductAddComponent,
    data: { title: 'Add Analyst Product' }
  },
  {
    path: 'edit/:id',
    component: ProcurmenetAnalystProductAddComponent,
    data: { title: 'Update Analyst Product' }
  }
]

@NgModule({
  declarations: [ProcurmenetAnalystProductAddComponent, ProcurmenetAnalystProductListComponent],
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
export class ProcurmenetAnalystProductModule { }
