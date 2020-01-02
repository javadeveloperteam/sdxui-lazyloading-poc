import { Routes, RouterModule } from '@angular/router'
import { ModuleWithProviders } from '@angular/core'
import { NotificationstatusWMSComponent } from './notificationstatus-wms/notificationstatus-wms.component'

export const routes: Routes = [
  {path: '', redirectTo: 'notification', pathMatch: 'full' },
  {path: 'notification', component: NotificationstatusWMSComponent }, // default route of the module
]

export const SplasherRouting: ModuleWithProviders = RouterModule.forChild(routes)
