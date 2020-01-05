import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationstatusWMSComponent } from './notificationstatus-wms/notificationstatus-wms.component';
import { CustomDatePipe } from './notificationstatus-wms/date-pipe';
import { SplasherRouting } from './splasher-routing.module';
import { CustomMaterialModule } from '../../core/material.module';
/* import { CommonComponent } from './../common/common.component'; */


@NgModule({
  declarations: [NotificationstatusWMSComponent,
    CustomDatePipe],
  imports: [
    CommonModule,
    SplasherRouting,
    CustomMaterialModule
  ],
  exports: [NotificationstatusWMSComponent, CustomDatePipe],
})
export class SplasherModule { }
