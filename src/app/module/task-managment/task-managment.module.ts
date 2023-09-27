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
import { TaskManagementListComponent } from './task-management-list/task-management-list.component';
import { TaskManagmentAddComponent } from './task-managment-add/task-managment-add.component';

const routes: Routes = [
  {
    path: "",
    component: TaskManagementListComponent,
    data: { title: 'Task Management list' }
  },
  {
    path: "add",
    component: TaskManagmentAddComponent,
    data: { title: 'Add Task Management' }
  },
  {
    path: 'edit/:id',
    component: TaskManagmentAddComponent,
    data: { title: 'Update Task Management' }
  }
]

@NgModule({
  declarations: [TaskManagmentAddComponent,TaskManagementListComponent],
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
export class TaskManagmentModule { }
