import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { MaterialExModule } from 'src/app/shared/material.module';
import { PageNotfoundComponent } from './page-not-found/page-not-found.component';
import { I18nModule } from 'src/app/shared/i18n/i18n.module';

const routes: Routes = [
  {
    path: "",
    component: PageNotfoundComponent,
    data: { title: '404' }
  }
]

@NgModule({
  declarations: [PageNotfoundComponent],
  imports: [
    CommonModule,
    MaterialExModule,
    I18nModule,
    RouterModule.forChild(routes),
  ],
})
export class NotfoundModule { }
