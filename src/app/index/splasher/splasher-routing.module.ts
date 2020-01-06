import { Routes, RouterModule } from '@angular/router'
import { ModuleWithProviders } from '@angular/core'
import { NotificationstatusWMSComponent } from './notificationstatus-wms/notificationstatus-wms.component'
import { EventstatusComponent } from '../content/SDXintelligence/eventstatus/eventstatus.component'

export const routes: Routes = [
  {path: '', redirectTo: 'notification', pathMatch: 'full' },
  {path: 'notification', component: NotificationstatusWMSComponent }, // default route of the module
  {path: 'eventstatus', component: EventstatusComponent },
]

export const SplasherRouting: ModuleWithProviders = RouterModule.forChild(routes)
