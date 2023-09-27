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
import { ProductCategoryListComponent } from './product-category-list/product-category-list.component';
import { ProductCategoryAddComponent } from './product-category-add/product-category-add.component';


const routes: Routes = [
  {
    path: "",
    component: ProductCategoryListComponent,
    data: { title: 'Product Category list' }
  },
  {
    path: "add",
    component: ProductCategoryAddComponent,
    data: { title: 'Add Product Category' }
  },
  {
    path: 'edit/:id',
    component: ProductCategoryAddComponent,
    data: { title: 'Update Product Category' }
  }
]

@NgModule({
  declarations: [ProductCategoryAddComponent,ProductCategoryListComponent],
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
export class ProductCategoryModule { }
