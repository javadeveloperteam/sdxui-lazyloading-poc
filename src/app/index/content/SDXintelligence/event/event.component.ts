import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource, MatTable, MatDialog } from '@angular/material';
import { Router } from "@angular/router";
import { CommonService } from 'src/app/common/services/common.service';
import { EventService } from "../event/services/event.service";
import { AlertPopupComponent } from '../../users/modal/alert-popup/alert-popup.component';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-event',
  templateUrl: './event.component.html',
  styleUrls: ['./event.component.css']
})
export class EventComponent implements OnInit {

  showLoader: Boolean = false;
  events: any;
  displayedColumns = ['eventName', 'applicationName', 'eventType','Action'];
  dataSource: MatTableDataSource<any>;
 
  
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatTable, { static: true }) table: MatTable<any>;

  constructor(
    private router: Router,
    private eventService: EventService,
    private commonService: CommonService,
    public dialog: MatDialog) {
  }

  ngOnInit() {
    this.showLoader = true;
    this.eventService.getAllEvents().subscribe(
      res => {
        this.showLoader = false;
        console.log(res);
        this.events = res;
        this.dataSource = new MatTableDataSource(this.events);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sortingDataAccessor = ((data, sortHeaderId) => {
          if (typeof data[sortHeaderId] == 'string') {
            return data[sortHeaderId].toString().toLowerCase();
          }
          else {
            return data[sortHeaderId];
          }
        });
        this.dataSource.sort = this.sort;
        this.dataSource.filterPredicate = function (data, filter: string): boolean {
          return data.eventName.toLowerCase().includes(filter);
        };
          // Retain Filter
          let searchFilter = $('#searchElement').val();
          if(searchFilter != null && searchFilter != '')
          {
            this.applyFilter(searchFilter.toString());
          }
      },
      err => {
        this.showLoader = false;
        this.commonService.openSnackBar('Variable Load Failed', 'badge-danger');
        console.log("Error occured");
      }
    );
  }

  deleteEventPopUp(applicationId: any, eventId: any, eventName: any) {
    this.showLoader = true;
    this.eventService.getEventDependents(applicationId, eventId).subscribe(
      res => {
        this.showLoader = false;
        let dataJson: {} = res;
        console.log(Object.keys(dataJson).length);
        if (Object.keys(dataJson).length > 0) {
          console.log(dataJson);
          let content = 'This Event is Associated with below Entity(s)';
          for (let key in dataJson) {
            content += '<br><br><b>' + key + ':</b>';
            for (let i = 0; i < dataJson[key].length; i++) {
              content += '<br> &nbsp &nbsp ' + (i + 1) + ')' + dataJson[key][i];
            }
          }
          content += '<br><br>Kindly Delete the Associated Entities and Try Again';
          const dialogRef = this.dialog.open(AlertPopupComponent, {
            disableClose: true, data: {
              type: "alert",
              content: content,
              component:'event'
            }
          });
        }
        else {
          const dialogRef = this.dialog.open(AlertPopupComponent, {
            disableClose: true, data: {
              type: "submit",
              content: 'Event <b>"' + eventName + '"</b> will be Removed Permanently. Do you want to Proceed ?',
              component:'event'
            }
          });
          dialogRef.afterClosed().subscribe(result => {
            console.log(result);
            if ( dialogRef.componentInstance.isDelete == true ) {
                this.deleteEvent(applicationId, eventId, eventName);
              }
            
         
          });
        }

      },
      err => {
        this.showLoader = false;
      }
    );
  }
 
  deleteEvent(applicationId: any, eventId: any, eventName: any) {
    this.showLoader = true;
    this.eventService.deleteEvent(applicationId, eventId).subscribe(
      res => {
        this.showLoader = false;
        this.commonService.openSnackBar('Event - ' + eventName + ' Deleted Successfully', 'badge-success');
        this.ngOnInit();
      },
      err => {
        this.showLoader = false;
        this.commonService.openSnackBar('Event Deletion Failed', 'badge-danger');
      }
    );
  }

  editEvent(applicationId: any, eventId: any) {
    this.showLoader = true;
    this.router.navigate(['index/sdxintelligence/applications/editEvent']);
    localStorage.setItem("applicationId", applicationId);
    localStorage.setItem("eventId", eventId);
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }

}

