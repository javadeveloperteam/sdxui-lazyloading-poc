import { Component, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { Injectable } from "@angular/core";
import { ReferenceDataService } from "src/app/common/services/referencedata.service";
import { CommonService } from 'src/app/common/services/common.service';
import { FormBuilder, FormGroup, Validators, EmailValidator } from "@angular/forms";
import { MatDialogRef, MatDialog } from '@angular/material/dialog';
import { EventService } from '../../SDXintelligence/event/services/event.service';
import { Router } from '@angular/router';
import { MatPaginator, MatSort, MatTableDataSource, MatTable } from '@angular/material';
import { AlertPopupComponent } from '../../users/modal/alert-popup/alert-popup.component';
import { Subscription } from 'rxjs';

@Injectable()
@Component({
    selector: 'app-eventtype-dialog',
    templateUrl: './eventtype-dialog.component.html',
    styleUrls: ['./eventtype-dialog.component.css'],
    encapsulation: ViewEncapsulation.None
})
export class EventTypeDialogComponent implements OnInit {

    showLoader: Boolean = false;
    submitted: Boolean = false;
    referenceForm: FormGroup;
    closePop: Boolean = false;
  events: any = [];
  displayedColumns = ['fieldId', 'fieldValue', 'comments'];
  dataSource: MatTableDataSource<any>;


  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatTable, { static: true }) table: MatTable<any>;



    constructor(
        private formBuilder: FormBuilder,
        private referenceDataService: ReferenceDataService,
        public dialogRef: MatDialogRef<EventTypeDialogComponent>,
      private router: Router,
        private eventService: EventService,
        private commonService: CommonService,
        public dialog: MatDialog) {
    }


    ngOnInit() {

        // Declare Form
        this.referenceForm = this.formBuilder.group({
            fieldName: ['EVENT_TYPE'],
            fieldValue: [null, Validators.required],
            active: ['true', Validators.required],
            comments: [],
            createdBy: [],
            createdByName: [],
            createdOn: []
        });
        this.getEventGrid()
    }
getEventGrid(){
    this.showLoader = true;

    this.eventService.getEventList().subscribe(
      res => {
        this.showLoader = false;
        console.log(res);
        this.events = res;
        this.dataSource = new MatTableDataSource(this.events);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.dataSource.filterPredicate = function (data, filter: string): boolean {
          return data.eventName.toLowerCase().includes(filter);
        };
      },
      err => {
        this.showLoader = false;
        this.commonService.openSnackBar('Variable Load Failed', 'badge-danger');
        console.log("Error occured");
      }
    );
}
    saveReferenceData() {
        this.submitted = true;
        if (this.referenceForm.invalid) {
            console.log('Mandatory fields missing');
            return;
        }

        this.showLoader = true;
        this.referenceDataService.createReferenceData(this.referenceForm.value).subscribe(
            res => {
                console.log(res);
                this.showLoader = false;
                this.dialogRef.close();
            },
            err => {
                this.showLoader = false;
                console.log("Error occured");
                console.log(err);
                this.commonService.openSnackBar('Event Type Creation Failed : ' + err.error.message, 'badge-danger');
            }
        );
    }

    close()
    {
        this.dialogRef.close();
    }

    get f() { return this.referenceForm.controls; }

 
    deleteEventPopUp(row){
      const dialogRef = this.dialog.open(AlertPopupComponent, {
        disableClose: true, data: {
            type: "submit",
            content: 'Event Type <b>"' + row.fieldValue + '"</b> will be Removed Permanently. Do you want to Proceed ?',
            component:'eventType'
        }
    });
    dialogRef.afterClosed().subscribe(result => {
      if ( dialogRef.componentInstance.isDelete == true ) {
        this.showLoader = true;
        this.eventService.deleteEventList(row.fieldId).subscribe(
          res => {
            this.commonService.openSnackBar('Event Type - ' + row.fieldValue + ' Deleted Successfully', 'badge-success');
            this.showLoader = false;
             this.getEventGrid();
          },
          err => {
            this.showLoader = false;
            console.error(err);
            this.commonService.openSnackBar('Event Type DELETE FAILED : ' + err.error.message, 'badge-danger');
          }
        );
    }
  

   
  });
}


}
