import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource, MatTable } from '@angular/material';
import { Router } from "@angular/router";
import { CommonService } from 'src/app/common/services/common.service';
import { MessageService } from "../notificationstatus/services/message.service";
import { DashboardService } from "./services/dashboard.service";
declare var $: any;

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {


  showLoader: Boolean = false;
  messages: any;
  displayedColumns = ['messageId', 'message', 'messageStatus', 'emailId', 'createdByName'];
  dataSource: MatTableDataSource<any>;
  dailyData: any;
  completedValue: any;
  openValue: any;
  errorValue: any;

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatTable, { static: true }) table: MatTable<any>;

  constructor(
    private router: Router,
    private messageService: MessageService,
    private commonService: CommonService,
    private dashboard: DashboardService) {
  }

  ngOnInit() {
    this.showLoader = true;
    this.messageService.getMessageListWithFilter(null, null, 'LAST_ONE_WEEK').subscribe(
      res => {
        //this.commonService.openSnackBar("Message Loaded Successfully", 'badge-success');

        this.messages = res;
        this.dataSource = new MatTableDataSource(this.messages);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.dataSource.filterPredicate = function (data, filter: string): boolean {
          return data.message.toLowerCase().includes(filter);
        };
      },
      err => {
        this.showLoader = false;
        //this.commonService.openSnackBar('Message Load Failed', 'badge-danger');
        console.log("Error occured");
      }
    );
  }
  ngAfterViewInit() {
    this.dashboard.getDailyData().subscribe(res => {
      this.dailyData = res;
      let dailyStatus = this.dailyData.status;
      console.log(this.dailyData);
      for (var key in dailyStatus) {
        if (dailyStatus[key].status == "Completed") {
          this.completedValue = dailyStatus[key].value;
        }
        if (dailyStatus[key].status == "Open") {
          this.openValue = dailyStatus[key].value;
        }
        if (dailyStatus[key].status == "Error") {
          this.errorValue = dailyStatus[key].value;
        }

      }

      let total = this.completedValue + this.openValue + this.errorValue;

      //setTimeout(function () {

      // Get percentage
      let completedNum = (this.completedValue / total) * 100;
      let openNum = (this.openValue / total) * 100;
      let errorNum = (this.errorValue / total) * 100;

      // Change to multiple of 10s
      let completedPercentage = Math.ceil(completedNum / 10) * 10;
      let openPercentage = Math.ceil(openNum / 10) * 10;
      let errorPercentage = Math.ceil(errorNum / 10) * 10;

      $("#completed").attr("data-percentage", completedPercentage);
      $("#open").attr("data-percentage", openPercentage);
      $("#error").attr("data-percentage", errorPercentage);
      // }, 2000);

      this.showLoader = false;

    },
      err => {
        this.showLoader = false;
        //this.commonService.openSnackBar('Dashboard Load Failed', 'badge-danger');
        console.log("Error occured");
      }
    );


    /* $("#completed").attr("data-percentage",this.completed); */
  }
  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }
}
