import { BrowserModule } from '@angular/platform-browser';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { DataTablesModule } from 'angular-datatables';
import {
  MatInputModule, MatPaginatorModule, MatProgressSpinnerModule, MatNativeDateModule,
  MatSortModule, MatTableModule, MatFormFieldModule, MatButtonModule, MatSnackBarModule, MatDatepickerModule
} from '@angular/material';
import { MatDialogModule } from '@angular/material/dialog';
import { NgSelectModule } from '@ng-select/ng-select';
import { CommonModule } from '@angular/common';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { AppRoutingModule } from './app-routing.module';
import { SharedLazyModule } from './shared/shared-lazyload.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { UnauthorizedComponent } from './unauthorized/unauthorized.component';
import { RegisterComponent } from './register/register.component';
import { ForgotpwdComponent } from './forgotpwd/forgotpwd.component';
import { IndexComponent } from './index/index.component';
import { FooterComponent } from './index/footer/footer.component';
import { HeaderComponent } from './index/header/header.component';
import { MenuComponent } from './index/menu/menu.component';
import { DashboardComponent } from './index/content/dashboard/dashboard.component';
import { UsersComponent } from './index/content/users/users.component';
import { UserslistComponent } from './index/content/users/userslist/userslist.component';
import { BarchartComponent } from './index/content/dashboard/barchart/barchart.component';
import { PiechartComponent } from './index/content/dashboard/piechart/piechart.component';
import { RadarchartComponent } from './index/content/dashboard/radarchart/radarchart.component';
import { LinechartComponent } from './index/content/dashboard/linechart/linechart.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ResetpwdComponent } from './resetpwd/resetpwd.component';
import { CustomerComponent } from './index/content/customer/customer.component';
import { CustomerlistComponent } from './index/content/customer/customerlist/customerlist.component';
import { ConfigurationComponent } from './index/content/configuration/configuration.component';
import { ConfigurationlistComponent } from './index/content/configuration/configurationlist/configurationlist.component';
import { DepartmentComponent } from './index/content/department/department.component';
import { DepartmentlistComponent } from './index/content/department/departmentlist/departmentlist.component';
import { DestinationComponent } from './index/content/destination/destination.component';
import { DestinationlistComponent } from './index/content/destination/destinationlist/destinationlist.component';
import { CommonComponent } from './common/common.component';
import { GroupComponent } from './index/content/group/group.component';
import { GrouplistComponent } from './index/content/group/grouplist/grouplist.component';
import { GroupmemberComponent } from './index/content/group/groupmember/groupmember.component';
import { NotificationstatusComponent } from './index/content/notificationstatus/notificationstatus.component';
import { ScheduleComponent } from './index/content/schedule/schedule.component';
import { SchedulelistComponent } from './index/content/schedule/schedulelist/schedulelist.component';

import { SendmessageComponent } from './index/content/sendmessage/sendmessage.component';
import { UserDialogComponent } from './index/content/dialog/user-dialog/user-dialog.component';
import { DestinationDialogComponent } from './index/content/dialog/destination-dialog/destination-dialog.component';
import { EventTypeDialogComponent } from './index/content/dialog/eventtype-dialog/eventtype-dialog.component';
import { GroupDialogComponent } from './index/content/dialog/group-dialog/group-dialog.component';
import { AssetDialogComponent } from './index/content/dialog/asset-dialog/asset-dialog.component';
import { UserDeptPopupComponent } from './index/content/dialog/user-dept-popup/user-dept-popup.component';
import { RuleDialogComponent } from './index/content/dialog/rule-dialog/rule-dialog.component';
import { GroupDestDialogComponent } from './index/content/dialog/group-dest-dialog/group-dest-dialog.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
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
import { EventComponent } from './index/content/SDXintelligence/event/event.component';
import { ApplicationlistComponent } from './index/content/SDXintelligence/application/applicationlist/applicationlist.component';
import { EventvariableComponent } from './index/content/SDXintelligence/eventvariable/eventvariable.component';
import { EventtypeComponent } from './index/content/SDXintelligence/application/eventtype/eventtype.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { LocationdialogComponent } from './index/content/SDXintelligence/asset/dialogbox/locationdialog/locationdialog.component';
import { ContactDialogComponent } from './index/content/SDXintelligence/asset/dialogbox/contact-dialog/contact-dialog.component';
import { DepartmentDialogComponent } from './index/content/SDXintelligence/asset/dialogbox/department-dialog/department-dialog.component';
import { EventRecordViewComponent } from './index/content/SDXintelligence/eventstatus/event-record-view/event-record-view.component';
import { AlertPopupComponent } from './index/content/users/modal/alert-popup/alert-popup.component';
import { CalendarviewComponent } from './index/content/schedule/calendarview/calendarview.component';
import { CalendarPopupComponent } from './index/content/schedule/calendar-popup/calendar-popup.component';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthenticationInterceptor } from './services/auth/auth.interceptor';
import { DayCalenderPopUpComponent } from './index/content/schedule/day-calender-pop-up/day-calender-pop-up.component';
import { AppEventPopupComponent } from './index/content/dialog/app-event-popup/app-event-popup.component';
import { AcknowledgeComponent } from './acknowledge/acknowledge.component';
import { UserGroupDialogComponent } from './index/content/dialog/user-group-dialog/user-group-dialog.component';
import { SplasherModule } from './index/splasher/splasher.module';


@NgModule({
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  declarations: [
    AppComponent,
    LoginComponent,
    UnauthorizedComponent,
    RegisterComponent,
    ForgotpwdComponent,
    IndexComponent,
    FooterComponent,
    HeaderComponent,
    MenuComponent,
    DashboardComponent,
    UsersComponent,
    UserslistComponent,
    BarchartComponent,
    PiechartComponent,
    RadarchartComponent,
    LinechartComponent,
    ResetpwdComponent,
    CustomerComponent,
    CustomerlistComponent,
    ConfigurationComponent,
    ConfigurationlistComponent,
    DepartmentComponent,
    DepartmentlistComponent, CommonComponent,
    DestinationComponent,
    DestinationlistComponent,
    GroupComponent,
    GrouplistComponent,
    GroupmemberComponent,
    NotificationstatusComponent,
    ScheduleComponent, SchedulelistComponent, CalendarviewComponent,
    SendmessageComponent,
    UserDialogComponent,
    DestinationDialogComponent,
    EventTypeDialogComponent,
    GroupDialogComponent,
    GroupDestDialogComponent,
    AssetDialogComponent,
    RuleDialogComponent,
    EventstatusComponent,
    LocationComponent,
    LocationlistComponent,
    AssetComponent,
    AssetlistComponent,
    AssetuserComponent,
    RulesComponent,
    RuleslistComponent,
    PolicyComponent,
    PolicylistComponent,
    PolicyassetComponent,
    ClientadapterComponent,
    MessageblockingComponent,
    ApplicationComponent,
    EventComponent,
    ApplicationlistComponent,
    EventvariableComponent,
    EventtypeComponent, LocationdialogComponent,
    DepartmentDialogComponent,
    EventRecordViewComponent,
    ContactDialogComponent,
    AlertPopupComponent,
    CalendarPopupComponent,
    DayCalenderPopUpComponent,
    UserDeptPopupComponent,
    AppEventPopupComponent,
    AcknowledgeComponent,
    UserGroupDialogComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    SharedLazyModule.getTranslateModuleforUser(),
    DataTablesModule,
    BrowserAnimationsModule,
    MatInputModule, MatPaginatorModule, MatProgressSpinnerModule,
    MatSortModule, MatTableModule, MatFormFieldModule, MatButtonModule,
    FormsModule, ReactiveFormsModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSnackBarModule,
    NgSelectModule,
    MatDialogModule,
    MatCheckboxModule,
    DragDropModule,
    CommonModule,
    FormsModule,
    SplasherModule,
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory
    })
  ],
  providers: [{
    provide: HTTP_INTERCEPTORS,
    useClass: AuthenticationInterceptor,
    multi: true
  }],
  bootstrap: [AppComponent],
  exports: [FormsModule],
  entryComponents: [UserDialogComponent, DestinationDialogComponent, GroupDialogComponent, AssetDialogComponent,
    GroupDestDialogComponent, RuleDialogComponent, LocationdialogComponent,
    EventTypeDialogComponent, ContactDialogComponent, DepartmentDialogComponent, AppEventPopupComponent,
    AlertPopupComponent, EventRecordViewComponent, CalendarPopupComponent, DayCalenderPopUpComponent, UserDeptPopupComponent, UserGroupDialogComponent]
})
export class AppModule { }
