import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationsComponent } from './notifications.component';
import { MaterialExModule } from 'src/app/shared/material.module';
import { I18nModule } from 'src/app/shared/i18n/i18n.module';

@NgModule({
  declarations: [NotificationsComponent],
  imports: [
    CommonModule,
    MaterialExModule, I18nModule
  ],
  exports: [
    NotificationsComponent
  ]
})
export class NotificationsModule { }
