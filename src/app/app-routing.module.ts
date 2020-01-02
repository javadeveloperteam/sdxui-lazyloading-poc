import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { UnauthorizedComponent } from './unauthorized/unauthorized.component';
import { RegisterComponent } from './register/register.component';
import { ForgotpwdComponent } from './forgotpwd/forgotpwd.component';
import { IndexComponent } from './index/index.component';
import { DashboardComponent } from './index/content/dashboard/dashboard.component';
import { UsersComponent } from './index/content/users/users.component';
import { UserslistComponent } from './index/content/users/userslist/userslist.component';
import { AppComponent } from './app.component';
import { AuthGuard } from './services/auth/_guards/auth.guard';
import { HttpClientModule } from '@angular/common/http';
import { ResetpwdComponent } from './resetpwd/resetpwd.component';
import { CustomerComponent } from './index/content/customer/customer.component';
import { CustomerlistComponent } from './index/content/customer/customerlist/customerlist.component';
import { ConfigurationComponent } from './index/content/configuration/configuration.component';
import { ConfigurationlistComponent } from './index/content/configuration/configurationlist/configurationlist.component';
import { DepartmentComponent } from './index/content/department/department.component';
import { DepartmentlistComponent } from './index/content/department/departmentlist/departmentlist.component';
import { DestinationComponent } from './index/content/destination/destination.component';
import { DestinationlistComponent } from './index/content/destination/destinationlist/destinationlist.component';
import { GroupComponent } from './index/content/group/group.component';
import { GrouplistComponent } from './index/content/group/grouplist/grouplist.component';
import { GroupmemberComponent } from './index/content/group/groupmember/groupmember.component';
import { SendmessageComponent } from './index/content/sendmessage/sendmessage.component';
import { NotificationstatusComponent } from './index/content/notificationstatus/notificationstatus.component';
import { ScheduleComponent } from './index/content/schedule/schedule.component';
import { SchedulelistComponent } from './index/content/schedule/schedulelist/schedulelist.component';
import { CalendarviewComponent } from './index/content/schedule/calendarview/calendarview.component';
import { EventstatusComponent } from './index/content/SDXintelligence/eventstatus/eventstatus.component';
import { LocationComponent } from './index/content/SDXintelligence/location/location.component';
import { LocationlistComponent } from './index/content/SDXintelligence/location/locationlist/locationlist.component';
import { AssetComponent } from './index/content/SDXintelligence/asset/asset.component';
import { AssetlistComponent } from './index/content/SDXintelligence/asset/assetlist/assetlist.component';
import { AssetuserComponent } from './index/content/SDXintelligence/asset/assetuser/assetuser.component';
import { RulesComponent } from './index/content/SDXintelligence/rules/rules.component';
import { RuleslistComponent } from './index/content/SDXintelligence/rules/ruleslist/ruleslist.component';
import { PolicyComponent } from './index/content/SDXintelligence/policy/policy.component';
import { PolicylistComponent } from './index/content/SDXintelligence/policy/policylist/policylist.component';
import { PolicyassetComponent } from './index/content/SDXintelligence/policy/policyasset/policyasset.component';
import { ClientadapterComponent } from './index/content/SDXintelligence/clientadapter/clientadapter.component';
import { MessageblockingComponent } from './index/content/SDXintelligence/messageblocking/messageblocking.component';
import { ApplicationComponent } from './index/content/SDXintelligence/application/application.component';
import { ApplicationlistComponent } from './index/content/SDXintelligence/application/applicationlist/applicationlist.component';
import { EventComponent } from './index/content/SDXintelligence/event/event.component';
import { EventvariableComponent } from './index/content/SDXintelligence/eventvariable/eventvariable.component';
import { EventtypeComponent } from './index/content/SDXintelligence/application/eventtype/eventtype.component';
import { AcknowledgeComponent } from './acknowledge/acknowledge.component';


const routes: Routes = [
  {
    path: '',
    component: AppComponent,
    children: [
  {
    path: '',
    redirectTo: 'index', pathMatch: 'full'
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'register',
    component: RegisterComponent
  },
  {
    path: 'forgotPassword',
    component: ForgotpwdComponent
  },
  {
    path: 'setPassword/:tokenUrl',
    component: ResetpwdComponent,
    data: { activateUser: true }
  },
  {
    path: 'changePassword/:message',
    component: ResetpwdComponent,
    data: { activateUser: false }
  },
  {
    path: 'acknowledge/:message',
    component: AcknowledgeComponent
  },
  {
    path: 'tokenExpired',
    component: LoginComponent,
    data: { message: 'Invalid URL/Token', messageType : 'danger' }
  },
  {
    path: 'index',
    component: IndexComponent,
    canActivate: [AuthGuard],
    children: [
      {path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      {path: 'dashboard', component: DashboardComponent},
      {
        path: 'unauthorized',
        component: UnauthorizedComponent,
      },
      {
        path: 'splasher',
        loadChildren : './splasher/splasher.module#SplasherModule',
      },
      {
        path: 'users',
        component: UserslistComponent,
        canActivate: [AuthGuard]},

      {
        path: 'users/:page',
        component: UsersComponent,
        canActivate: [AuthGuard]},

        {
          path: 'customer',
          component: CustomerComponent},
        {
          path: 'customer/customerlist',
          component: CustomerlistComponent},
          {
            path: 'configurations/:page',
            component: ConfigurationComponent,
            canActivate: [AuthGuard]},

          {
          path: 'configurations',
          component: ConfigurationlistComponent,
          canActivate: [AuthGuard]},
          {
          path: 'departments',
          component: DepartmentlistComponent,
          canActivate: [AuthGuard]},

          {
          path: 'departments/:page',
          component: DepartmentComponent,
          canActivate: [AuthGuard]},
          {
            path: 'destinations',
            component: DestinationlistComponent,
            canActivate: [AuthGuard]},

            {
            path: 'destinations/:page',
            component: DestinationComponent,
            canActivate: [AuthGuard]},

          {
            path: 'group',
            component: GroupComponent,
            canActivate: [AuthGuard]},

            {
            path: 'groups',
            component: GrouplistComponent,
            canActivate: [AuthGuard]},
            {
            path: 'groups/:page',
            component: GroupComponent,
            canActivate: [AuthGuard]},
            {
              path: 'sendmessage',
              component: SendmessageComponent,
              canActivate: [AuthGuard]},
            {
              path: 'notificationstatus',
              component: NotificationstatusComponent,
              canActivate: [AuthGuard]
            },
            {
              path: 'schedules',
              component: SchedulelistComponent,
              canActivate: [AuthGuard]},
              {
                path: 'schedules/calendarview',
                component: CalendarviewComponent,
                canActivate: [AuthGuard]
              },
              {
              path: 'schedules/:page',
              component: ScheduleComponent,
              canActivate: [AuthGuard]},
          {
            path: 'sdxintelligence/eventstatus',
            component: EventstatusComponent,
            canActivate: [AuthGuard]
          },
          {
            path: 'sdxintelligence/locations/:page',
            component: LocationComponent,
            canActivate: [AuthGuard]
          },
          {
            path: 'sdxintelligence/locations',
            component: LocationlistComponent,
            canActivate: [AuthGuard]
          },
          {
            path: 'sdxintelligence/assets/:page',
            component: AssetComponent,
            canActivate: [AuthGuard]
          },
          {
            path: 'sdxintelligence/assets',
            component: AssetlistComponent,
            canActivate: [AuthGuard]
          },
          {
            path: 'sdxintelligence/asset/assetuser',
            component: AssetuserComponent,
            canActivate: [AuthGuard]
          },
       {
            path: 'sdxintelligence/rules/:page',
            component: RulesComponent,
            canActivate: [AuthGuard]
          },
          {
            path: 'sdxintelligence/rules',
            component: RuleslistComponent,
            canActivate: [AuthGuard]
          },
          {
            path: 'sdxintelligence/policies/:page',
            component: PolicyComponent,
            canActivate: [AuthGuard]
          },
          {
            path: 'sdxintelligence/policies',
            component: PolicylistComponent,
            canActivate: [AuthGuard]
          },
          {
            path: 'sdxintelligence/policy/policyasset',
            component: PolicyassetComponent,
            canActivate: [AuthGuard]
          },
          {
            path: 'sdxintelligence/clientadapter',
            component: ClientadapterComponent,
            canActivate: [AuthGuard]
          },
          {
            path: 'sdxintelligence/messageblocking',
            component: MessageblockingComponent,
            canActivate: [AuthGuard]
          },
      {
            path: 'sdxintelligence/applications/:page',
            component: ApplicationComponent,
            canActivate: [AuthGuard]
          },
		  {
            path: 'sdxintelligence/applications',
            component: ApplicationlistComponent,
            canActivate: [AuthGuard]
          },
		  {
            path: 'sdxintelligence/application/eventtype',
            component: EventtypeComponent,
            canActivate: [AuthGuard]
          },
          {
            path: 'sdxintelligence/events',
            component: EventComponent,
            canActivate: [AuthGuard]
          },
          {
            path: 'sdxintelligence/eventvariables',
            component: EventvariableComponent,
            canActivate: [AuthGuard]
          }


    ] 
  }
]
  }

];

@NgModule({
  imports: [RouterModule.forRoot(routes),BrowserModule,
    HttpClientModule],
  exports: [RouterModule]
})
export class AppRoutingModule { }
