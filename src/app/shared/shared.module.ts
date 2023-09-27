import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NumberDirective, FloatNumberDirective } from './directive/number.directive';
import { PricePipe, SafePipe } from './pipe/status.pipe';
import { RouterBackDirective, onlyCharactersDirective, onlyNumbersAndHyphenDirective } from './directive/router-back.directive';
import { ActionPopupModule } from '../core/action-popup/action-popup.module';

const components = [
  NumberDirective,
  FloatNumberDirective,
  PricePipe,
  SafePipe,
  RouterBackDirective,
  onlyCharactersDirective,
  onlyNumbersAndHyphenDirective,

]
@NgModule({
  declarations: components,
  imports: [CommonModule, ActionPopupModule],
  exports: components
})
export class SharedModule { }
