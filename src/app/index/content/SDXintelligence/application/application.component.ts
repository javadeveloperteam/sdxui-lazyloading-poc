import { Component, OnInit, ViewChild } from '@angular/core';
import { ApplicationService } from "../../SDXintelligence/application/services/application.service";
import { EventService } from "../../SDXintelligence/event/services/event.service";
import { EventVariableService } from "../../SDXintelligence/eventvariable/services/eventvariable.service";
import { FormBuilder, FormGroup, Validators, EmailValidator } from "@angular/forms";
import { CommonService } from 'src/app/common/services/common.service';
import { ReferenceDataService } from 'src/app/common/services/referencedata.service';
import { ActivatedRoute, Router } from "@angular/router";
import { MatPaginator, MatSort, MatTableDataSource, MatTable } from '@angular/material';
import { EventTypeDialogComponent } from "../../dialog/eventtype-dialog/eventtype-dialog.component";
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-application',
  templateUrl: './application.component.html',
  styleUrls: ['./application.component.css']
})
export class ApplicationComponent implements OnInit {

  disableEvent: Boolean = true;
  disableEventVariable: Boolean = true;
  showLoader: Boolean = false;
  appSubmitted: Boolean = false;
  eventSubmitted: Boolean = false;
  variableSubmitted: Boolean = false;
  applicationForm: FormGroup;
  eventForm: FormGroup;
  eventVariableForm: FormGroup;
  currentPage: String = "add";
  appButtonName: String = "Create";
  eventButtonName: String = "Create";
  variableButtonName: String = "Create";
  application: any;
  event: any;
  eventVariable: any;
  eventTypes: any;
  events: any;
  eventMap: any = {};
  eventVariables: any;
  eventDisplayedColumns = ['eventId', 'eventName', 'eventType', 'applicationName', 'createdByName', 'Action'];
  eventDataSource: MatTableDataSource<any>;
  variableDisplayedColumns = ['variableId', 'variableName', 'eventName', 'applicationName', 'createdByName', 'Action'];
  variableDataSource: MatTableDataSource<any>;
  currentTabName = '';
  constructor(private formBuilder: FormBuilder,
    private applicationService: ApplicationService,
    private eventService: EventService,
    private eventVariableService: EventVariableService,
    private referenceDataService: ReferenceDataService,
    private route: ActivatedRoute,
    private router: Router,
    public dialog: MatDialog,
    private commonService: CommonService) {
    this.route.params.subscribe(params => this.currentPage = params['page']);
  }

  @ViewChild('paginator1', { static: true }) eventPaginator: MatPaginator;
  @ViewChild('paginator2', { static: true }) variablePaginator: MatPaginator;
  @ViewChild('matSort1', { static: true }) eventSort: MatSort;
  @ViewChild('matSort2', { static: true }) variableSort: MatSort;
  @ViewChild(MatTable, { static: true }) table: MatTable<any>;

  ngOnInit() {
    // Declare Form
    // Application Form

    window.scroll(0,0);
 

    this.applicationForm = this.formBuilder.group({
      applicationId: [],
      applicationName: ['', Validators.required],
      active: ['true'],
      comments: [],
      createdBy: [],
      createdByName: [],
      createdOn: []
    });

    // Event Form
    this.eventForm = this.formBuilder.group({
      eventId: [],
      eventName: ['', Validators.required],
      eventType: ['', Validators.required],
      applicationId: [],
      applicationName: [],
      active: ['true', Validators.required],
      comments: [],
      createdBy: [],
      createdByName: [],
      createdOn: []
    });

    // Event Variable Form
    this.eventVariableForm = this.formBuilder.group({
      variableId: [],
      variableName: ['', Validators.compose([Validators.required,
      Validators.pattern('[a-zA-Z]+')])],
      variableValue: [],
      variableType: ['', Validators.required],
      eventId: ['', Validators.required],
      eventName: [],
      applicationId: [],
      applicationName: [],
      active: ['true', Validators.required],
      comments: [],
      createdBy: [],
      createdByName: [],
      createdOn: []
    });
    // Patch Values if Edit
    console.log(this.currentPage);
    if (this.currentPage == "editApplication" || this.currentPage == "resetEvent" || this.currentPage == "resetVariable") {
      this.appButtonName = "Update";
      // this.eventButtonName = "Update";
      let applicationId = localStorage.getItem("applicationId");
      if (applicationId != null) {
        this.getApplication(applicationId);
        this.loadAllEventByApp(applicationId, null);
        this.loadReferenceData(null);
        if (this.currentPage == 'resetEvent') {
          $('#eventTab').click();
        }
        if (this.currentPage == 'resetVariable') {
          $('#variableTab').click();
        }
      }
      else {
        this.router.navigate(['index/sdxintelligence/applications']);
      }
    }
    else if (this.currentPage == "editEvent") {
      this.appButtonName = 'Update';
      this.eventButtonName = "Update";
      let applicationId = localStorage.getItem("applicationId");
      let eventId = localStorage.getItem("eventId");
      if (applicationId != null && eventId != null) {
        this.getApplication(applicationId);
        this.getEvent(applicationId, eventId);
        this.loadAllEventByApp(applicationId, null);
        $('#eventTab').click();
      }
      else {
        this.router.navigate(['index/sdxintelligence/events']);
      }
    }
    else if (this.currentPage == "editEventVariable") {
      this.appButtonName = 'Update';
      this.eventButtonName = "Update";
      this.variableButtonName = 'Update';
      let applicationId = localStorage.getItem("applicationId");
      let eventId = localStorage.getItem("eventId");
      let variableId = localStorage.getItem("variableId");
      if (applicationId != null && eventId != null && variableId != null) {
        this.getApplication(applicationId);
        this.getEvent(applicationId, eventId);
        this.getEventVariable(eventId, variableId);
        this.loadAllEventByApp(applicationId, eventId);
        this.loadAllVariableByEvent(eventId);
        $('#variableTab').click();
      }
      else {
        this.router.navigate(['index/sdxintelligence/variables']);
      }
    }
  }

  onSubmitApplication() {
    this.appSubmitted = true;
    if (this.applicationForm.invalid) {
      console.log(this.applicationForm);
      console.log('Mandatory fields missing');
      return;
    }
    if (this.currentPage == "editApplication") {
      this.updateApplication();
    }
    else {
      this.saveApplication();
      this.disableEvent = false;
    }
  }

  onSubmitEvent() {
    this.eventSubmitted = true;

    if (this.eventForm.invalid) {
      console.log(this.eventForm);
      console.log('Mandatory fields missing');
      return;
    }
    if (this.currentPage == "editEvent") {
      this.updateEvent();
    }
    else {
      this.saveEvent();
      this.disableEventVariable = false;
    }
  }

  onSubmitVariable() {
    this.variableSubmitted = true;
    if (this.eventVariableForm.invalid) {
      console.log('Mandatory fields missing');
      console.log(this.eventVariableForm);
      return;
    }

    this.vf.eventName.setValue(this.eventMap[this.vf.eventId.value]);

    if (this.currentPage == "editEventVariable") {
      this.updateEventVariable();
    }
    else {
      this.saveEventVariable();
    }
  }

  getApplication(applicationId: any) {
    this.applicationService.getApplication(applicationId).subscribe(
      res => {
        console.log(res);
        this.showLoader = false;
        this.application = res;
        this.applicationForm.patchValue(this.application);
        $('#appName').attr('disabled', 'disabled');
        this.disableEvent = false;
        this.disableEventVariable = false;
        this.updateApplicationParams();

      },
      err => {
        console.log("Error occured");
        this.showLoader = false;
        console.log(err);
        this.commonService.openSnackBar('Application Load Failed : ' + err.error.message, 'badge-danger');
      }
    );
  }


  getEvent(applicationId: any, eventId: any) {
    this.eventService.getEvent(applicationId, eventId).subscribe(
      res => {
        console.log(res);
        this.showLoader = false;
        this.event = res;
        this.eventForm.patchValue(this.event);
        this.loadReferenceData(this.event.eventType);
      },
      err => {
        console.log("Error occured");
        this.showLoader = false;
        console.log(err);
        this.commonService.openSnackBar('Event Load Failed : ' + err.error.message, 'badge-danger');
      }
    );
  }

  getEventVariable(eventId: any, variableId: any) {
    this.eventVariableService.getEventVariable(eventId, variableId).subscribe(
      res => {
        console.log(res);
        this.showLoader = false;
        this.eventVariable = res;
        this.eventVariableForm.patchValue(this.eventVariable);
       
      },
      err => {
        console.log("Error occured");
        this.showLoader = false;
        console.log(err);
        this.commonService.openSnackBar('Event Variable Load Failed : ' + err.error.message, 'badge-danger');
      }
    );
  }

  saveApplication() {
    this.showLoader = true;
    this.applicationService.createApplication(this.applicationForm.value).subscribe(
      res => {
        console.log(res);
        this.showLoader = false;
        this.applicationForm.patchValue(res);
        this.commonService.openSnackBar("Application Created Successfully", 'badge-success');
        localStorage.setItem("applicationId", JSON.stringify(this.af.applicationId.value));
        this.router.navigateByUrl('/index', { skipLocationChange: true }).then(() => {
          this.router.navigate(['index/sdxintelligence/applications/editApplication']);
        });
      },
      err => {
        this.showLoader = false;
        console.log("Error occured");
        console.log(err);
        this.commonService.openSnackBar('Application Creation Failed : ' + err.error.message, 'badge-danger');
      }
    );
  }

  updateApplication() {
    this.showLoader = true;
    this.applicationService.updateApplication(this.applicationForm.value).subscribe(
      res => {
        console.log(res);
        this.showLoader = false;
        this.commonService.openSnackBar("Application Updated Successfully", 'badge-success');
        // this.router.navigate(['index/rules']);
      },
      err => {
        this.showLoader = false;
        console.log("Error occured");
        console.log(err);
        this.commonService.openSnackBar('Application Update Failed : ' + err.error.message, 'badge-danger');
      }
    );
  }

  saveEvent() {
    this.showLoader = true;
    
    this.eventService.createEvent(this.eventForm.value).subscribe(
      res => {
        console.log(res);
        this.showLoader = false;
        this.commonService.openSnackBar("Event Created Successfully", 'badge-success');
        this.loadAllEventByApp(this.ef.applicationId.value, null);
        this.eventSubmitted = false;
        this.eventForm.reset();
        this.ef.eventType.setValue('');
        this.ef.active.setValue('true');
        this.updateApplicationParams();
      },
      err => {
        this.showLoader = false;
        console.log("Error occured");
        console.log(err);
        this.commonService.openSnackBar('Event Save Failed : ' + err.error.message, 'badge-danger');
      }
    );
  }

  updateEvent() {
    this.showLoader = true;
    this.eventService.updateEvent(this.eventForm.value).subscribe(
      res => {
        console.log(res);
        this.showLoader = false;
        this.commonService.openSnackBar("Event Updated Successfully", 'badge-success');
        this.resetEvent();
        //this.router.navigate(['index/rules']);
      },
      err => {
        this.showLoader = false;
        console.log("Error occured");
        console.log(err);
        this.commonService.openSnackBar('Event Update Failed : ' + err.error.message, 'badge-danger');
      }
    );
  }

  saveEventVariable() {
    this.showLoader = true;
    this.eventVariableService.createEventVariable(this.eventVariableForm.value).subscribe(
      res => {
        console.log(res);
        this.showLoader = false;
        this.commonService.openSnackBar("Variable Created Successfully", 'badge-success');
        this.loadAllVariableByEvent(this.vf.eventId.value);
        this.variableSubmitted = false;
        this.eventVariableForm.reset();
        this.vf.active.setValue('true');
        this.vf.eventId.setValue('');
        this.vf.variableType.setValue('');
        this.updateApplicationParams();
      },
      err => {
        this.showLoader = false;
        console.log("Error occured");
        console.log(err);
        this.commonService.openSnackBar('Variable Save Failed : ' + err.error.message, 'badge-danger');
      }
    );
  }

  updateEventVariable() {
    this.showLoader = true;
    this.eventVariableService.updateEventVariable(this.eventVariableForm.value).subscribe(
      res => {
        console.log(res);
        this.showLoader = false;
        this.commonService.openSnackBar("Variable Updated Successfully", 'badge-success');
        this.resetVariable();

      },
      err => {
        this.showLoader = false;
        console.log("Error occured");
        console.log(err);
        this.commonService.openSnackBar('Variable Update Failed : ' + err.error.message, 'badge-danger');
      }
    );
  }

  openEventTypePopUp() {

    // Open Dialog
    const dialogRef = this.dialog.open(EventTypeDialogComponent, { disableClose: true });

    // On close
    dialogRef.afterClosed().subscribe(result => {
      this.loadReferenceData(this.ef.eventType.value);
    });
  }

  loadReferenceData(eventType: any) {
    this.showLoader = true;
    this.referenceDataService.getReferenceData('EVENT_TYPE').subscribe(
      res => {
        this.showLoader = false;
        console.log(res);
        this.eventTypes = res;
        if (eventType != null) {
          this.ef.eventType.setValue(eventType);
        }
      },
      err => {
        this.showLoader = false;
        this.commonService.openSnackBar('Event Types Load Failed', 'badge-danger');
        console.log("Error occured");
      }
    );
  }

  updateApplicationParams() {
    this.ef.applicationId.setValue(this.af.applicationId.value);
    this.ef.applicationName.setValue(this.af.applicationName.value);
    this.vf.applicationId.setValue(this.af.applicationId.value);
    this.vf.applicationName.setValue(this.af.applicationName.value);
  }

  get af() { return this.applicationForm.controls; }
  get ef() { return this.eventForm.controls; }
  get vf() { return this.eventVariableForm.controls; }

  /* Table Related */

  loadAllEventByApp(applicationId: any, eventId: any) {
    this.showLoader = true;
    this.eventService.getAllEventsByApplication(applicationId).subscribe(
      res => {
        this.showLoader = false;
        console.log(res);
        //this.commonService.openSnackBar("Department Loaded Successfully", 'badge-success');

        this.events = res;
        if (eventId != null) {
          this.vf.eventId.setValue(eventId);
        }

        for (let i = 0; i < this.events.length; i++) {
          this.eventMap[this.events[i].eventId] = this.events[i].eventName;
        }
        this.eventDataSource = new MatTableDataSource(this.events);
        this.eventDataSource.paginator = this.eventPaginator;
        this.eventDataSource.sort = this.eventSort;
        this.eventDataSource.filterPredicate = function (data, filter: string): boolean {
          return data.eventName.toLowerCase().includes(filter);
        };
        // Enable the varibale Datasource
        this.variableDataSource = new MatTableDataSource(this.eventVariables);
        this.variableDataSource.paginator = this.variablePaginator;
        this.variableDataSource.sort = this.variableSort;
        this.variableDataSource.filterPredicate = function (data, filter: string): boolean {
          return data.variableName.toLowerCase().includes(filter);
        };

      },
      err => {
        this.showLoader = false;
        this.commonService.openSnackBar('Application Load Failed', 'badge-danger');
        console.log("Error occured");
      }
    );
  }

  loadAllVariableByEvent(eventId: any) {
    console.log(eventId);
    if (eventId.toString() == 'null') {
      this.variableDataSource = new MatTableDataSource();
      this.variableDataSource.paginator = this.variablePaginator;
      console.log('if');
      return;
    }
    this.showLoader = true;
    this.eventVariableService.getAllVariableByEvent(eventId).subscribe(
      res => {
        this.showLoader = false;
        console.log(res);
        //this.commonService.openSnackBar("Department Loaded Successfully", 'badge-success');

        this.eventVariables = res;
        this.variableDataSource = new MatTableDataSource(this.eventVariables);
        this.variableDataSource.paginator = this.variablePaginator;
        this.variableDataSource.sort = this.variableSort;
        this.variableDataSource.filterPredicate = function (data, filter: string): boolean {
          return data.variableName.toLowerCase().includes(filter);
        };
      },
      err => {
        this.showLoader = false;
        this.commonService.openSnackBar('Variable Load Failed', 'badge-danger');
        console.log("Error occured");
      }
    );
  }

  deleteEvent(applicationId: any, eventId: any, eventName: any) {
    this.showLoader = true;
    console.log(eventId);
    this.eventService.deleteEvent(applicationId, eventId).subscribe(
      res => {
        this.showLoader = false;
        this.commonService.openSnackBar('Event - ' + eventName + ' Deleted Successfully', 'badge-success');
        this.ngOnInit();
      },
      err => {
        this.showLoader = false;
        this.commonService.openSnackBar('Application Deletion Failed', 'badge-danger');
      }
    );
  }

  applyFilterEvent(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    this.eventDataSource.filter = filterValue;
  }

  deleteEventVariable(eventId: any, variableId: any, variableName: any) {
    this.showLoader = true;
    console.log(variableId);
    this.eventVariableService.deleteEventVariable(eventId, variableId).subscribe(
      res => {
        this.showLoader = false;
        this.commonService.openSnackBar('Variable - ' + variableName + ' Deleted Successfully', 'badge-success');
        this.ngOnInit();
      },
      err => {
        this.showLoader = false;
        this.commonService.openSnackBar('Variable Deletion Failed', 'badge-danger');
      }
    );
  }

  applyFilterVariable(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    this.variableDataSource.filter = filterValue;
  }

  tabClick(tabName: any) {
    this.currentTabName = tabName;
  }

  clear(id: any) {
     let url = this.router.url;

     if (this.currentTabName == 'Application') {
       url = '/index/sdxintelligence/applications/editApplication';
     }
     if (this.currentTabName == 'Event') {
       url = '/index/sdxintelligence/applications/resetEvent';
   
    }
     if (this.currentTabName == 'Variable') {
       url = '/index/sdxintelligence/applications/resetVariable';
     }
    
     this.router.navigateByUrl('/index', { skipLocationChange: true }).then(() => {
       this.router.navigate([url]);
     });
   
  }

  resetEvent()
  {
    this.router.navigateByUrl('/index', { skipLocationChange: true }).then(() => {
      this.router.navigate(['/index/sdxintelligence/applications/resetEvent']);
    });
  }
  
  resetVariable()
  {
    this.router.navigateByUrl('/index', { skipLocationChange: true }).then(() => {
      this.router.navigate(['/index/sdxintelligence/applications/resetVariable']);
    });
  }

  eventCellClick(element) {

    window.scroll(0, 0);
    this.eventButtonName = "Update";
    this.currentPage = "editEvent"
    this.eventForm.patchValue(element);


  }

  variableCellClick(element) {
    window.scroll(0, 0);
    this.variableButtonName = 'Update';
    this.currentPage = "editEventVariable"
    this.eventVariableForm.patchValue(element);

  }
}
