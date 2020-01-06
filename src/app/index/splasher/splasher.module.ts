import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationstatusWMSComponent } from './notificationstatus-wms/notificationstatus-wms.component';
import { CustomDatePipe } from './notificationstatus-wms/date-pipe';
import { SplasherRouting } from './splasher-routing.module';
import { CustomMaterialModule } from '../../core/material.module';
import { EventstatusComponent } from '../content/SDXintelligence/eventstatus/eventstatus.component';
import { EventRecordViewComponent } from '../content/SDXintelligence/eventstatus/event-record-view/event-record-view.component';
import { Common1Module } from 'src/app/common/common1.module';
/* import { CommonComponent } from './../common/common.component'; */


@NgModule({
  declarations: [NotificationstatusWMSComponent,
    EventstatusComponent,EventRecordViewComponent,
    CustomDatePipe],
  imports: [
    CommonModule,
    SplasherRouting,
    CustomMaterialModule,
    Common1Module
  ],
  exports: [NotificationstatusWMSComponent, CustomDatePipe],
  entryComponents: [EventRecordViewComponent]
})
export class SplasherModule { }
