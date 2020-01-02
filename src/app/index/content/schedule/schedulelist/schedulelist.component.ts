import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource, MatTable, MatDialog } from '@angular/material';
import { Router } from "@angular/router";
import { CommonService } from 'src/app/common/services/common.service';
import { ScheduleService } from "../services/schedule.service";
import { AlertPopupComponent } from '../../users/modal/alert-popup/alert-popup.component';
import { Subscription } from 'rxjs';
import { Helpers } from "src/app/helpers/helpers";

@Component({
  selector: 'app-schedulelist',
  templateUrl: './schedulelist.component.html',
  styleUrls: ['./schedulelist.component.css']
})
export class SchedulelistComponent implements OnInit {

  showLoader: Boolean = false;
  userRole : any;
  schedules: any;
  displayedColumns = [ 'scheduleName',  'occurrenceType', 'active'];
  dataSource: MatTableDataSource<any>;


  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatTable, { static: true }) table: MatTable<any>;

  constructor(
    private router: Router,
    private scheduleService: ScheduleService,
    private commonService: CommonService,
    public dialog: MatDialog) {
      this.userRole = Helpers.getUserRole();
      if(this.userRole != 'User')
      {
          this.displayedColumns.push('action');
      }
  
  }

  ngOnInit() {
    this.showLoader = true;
    this.scheduleService.getAllSchedule().subscribe(
      res => {
        this.showLoader = false;
        console.log(res);
        //this.commonService.openSnackBar("Schedule Loaded Successfully", 'badge-success');

        this.schedules = res;
        this.dataSource = new MatTableDataSource(this.schedules);
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
          return data.scheduleName.toLowerCase().includes(filter);
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
        this.commonService.openSnackBar('Schedule Load Failed', 'badge-danger');
        console.log("Error occured");
      }
    );
  }

  deleteSchedule(scheduleId: any, scheduleName: any) {
      const dialogRef = this.dialog.open(AlertPopupComponent, {
      disableClose: true, data: {
          type: "submit",
          component:"schedule",
          content: 'Schedule <b>"' + scheduleName + '"</b> will be Removed Permanently. Do you want to Proceed ?'
      }
  });
  dialogRef.afterClosed().subscribe(result => {
    if ( dialogRef.componentInstance.isDelete == true ) {
    this.showLoader = true;
    console.log(scheduleId);
    this.scheduleService.deleteSchedule(scheduleId).subscribe(
      res => {
        this.showLoader = false;
          this.commonService.openSnackBar('Schedule - ' + scheduleName + ' Deleted Successfully', 'badge-success');
          this.ngOnInit();
      },
      err => {
        this.commonService.openSnackBar('Schedule Deletion Failed', 'badge-danger');
      }
    );
          }
        
      });
  }
  statusUpdate(schedule :any)
  {
    // update contact
    schedule.active = !schedule.active;
    this.updateSchedule(schedule);
  }
  updateSchedule(schedule: any) {
    this.showLoader = true;
    this.scheduleService.updateSchedule(schedule).subscribe(
      res => {
        this.showLoader = false;
        console.log(res);
        this.commonService.openSnackBar("Schedule Updated Successfully", 'badge-success');
        this.router.navigate(['index/schedules']);
      },
      err => {
        this.showLoader = false;
        console.error(err);
        console.log("Error occured");
        this.commonService.openSnackBar("Schedule Update Failed : "+err.error.message, 'badge-danger');
      }
    );
  }

  editSchedule(scheduleId: any) {
    this.showLoader = true;
    this.router.navigate(['index/schedules/edit']);
    localStorage.setItem("scheduleId", JSON.stringify(scheduleId));
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }

}
