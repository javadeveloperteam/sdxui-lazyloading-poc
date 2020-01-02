import { Component, OnInit, Inject, ViewChild, ViewEncapsulation } from '@angular/core';
import { MAT_DIALOG_DATA, MatTableDataSource, MatPaginator, MatSort, MatTable } from '@angular/material';
import { EventService } from '../../SDXintelligence/event/services/event.service';

@Component({
  selector: 'app-app-event-popup',
  templateUrl: './app-event-popup.component.html',
  styleUrls: ['./app-event-popup.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class AppEventPopupComponent implements OnInit {
  calendarData: any = []
  displayedColumns: any = ['eventName', "eventType","applicationName"];
  dataSource: MatTableDataSource<any>;
  events: any = [];
  showLoader = false;
  applicationName : string = '';

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatTable, { static: true }) table: MatTable<any>;
  
  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
  private eventService : EventService) { }

  ngOnInit() {
    this.showLoader = true;
    let applicationId = null;
    if(this.data != undefined && this.data.applicationId != undefined)
    {
      applicationId = this.data.applicationId;
    }

    if(applicationId != null)
    {
      this.getEventList(applicationId);
    }
    else
    {
      this.showLoader = false;
    }
  }

  getEventList(applicationId: any) {
    this.eventService.getAllEventsByApplication(applicationId).subscribe(
      res => {
        console.log(res);
        this.showLoader = false;
        this.events = res;
        if(this.events != null)
        {
          this.applicationName = this.events.length > 0 ? this.events[0].applicationName : '';
        }
        this.dataSource = new MatTableDataSource(this.events);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.dataSource.filterPredicate = function (data, filter: string): boolean {
          return data.eventName.toLowerCase().includes(filter);
        };

      },
      err => {
        console.log("Error occured");
        console.log(err);
      }
    );
  }

}
