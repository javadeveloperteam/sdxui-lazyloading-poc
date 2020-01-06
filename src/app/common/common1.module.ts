import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Common1RoutingModule } from './common1-routing.module';
import { CommonComponent } from './common.component';


@NgModule({
  declarations: [
    CommonComponent
  ],
  imports: [
    CommonModule,
    Common1RoutingModule
  ],
  exports: [CommonComponent],
})
export class Common1Module { }
