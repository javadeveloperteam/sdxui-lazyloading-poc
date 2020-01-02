import { Component, OnInit, ViewChild, ViewEncapsulation,PipeTransform,Pipe  } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource, MatTable } from '@angular/material';
import { Router } from "@angular/router";
import { CommonService } from 'src/app/common/services/common.service';
import { Helpers } from "src/app/helpers/helpers";
import { MessageService } from 'src/app/index/content/notificationstatus/services/message.service';

@Component({
  selector: 'app-notificationstatus-wms',
  templateUrl: './notificationstatus-wms.component.html',
  styleUrls: ['./notificationstatus-wms.component.css'],
  encapsulation: ViewEncapsulation.None
})

export class NotificationstatusWMSComponent implements OnInit  {

  showLoader: Boolean = false;
  messages: any;
  displayedColumns = ['message', 'type', 'messageStatus', 'userName','contactName', 'groupName', 'createdOn'];
  dataSource: MatTableDataSource<any>;
  userRole: any;
  todayDate: any;
  disableDate: any = true;
  endDate: Date;
  minEndDate: any;
  maxEndDate: any;
  interval: any;
  startdate:any
  enddate:any

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatTable, { static: true }) table: MatTable<any>;

  constructor(
    private router: Router,
    private messageService: MessageService,
    private commonService: CommonService) {
    this.userRole = Helpers.getUserRole();
    if (this.userRole != 'User') {
      // this.displayedColumns.push('action');
    }

  }

  ngOnInit() {
    this.showLoader = true;

    // Set Today's date as max limit
    this.todayDate = new Date();
    // Start date limit 90 days
   /*  this.interval = setInterval(() => { 
      this.handleRefresh();
   }, 60000); */ // set interval to 60s
    let date = new Date();
    date.setDate(date.getDate() - 90);
    this.minEndDate = date;
    this.maxEndDate = this.todayDate;

    $('#dateFilter').val('LAST_ONE_WEEK');
    this.loadAllMessages(null, null, 'LAST_ONE_WEEK');
  }

  loadAllMessages(startDate: any, endDate: any, dateFilter: any) {
    this.messageService.getMessageListWithFilter(startDate, endDate, dateFilter).subscribe(
      res => {
        this.showLoader = false;
        console.log(res);
        this.messages = res;
        this.dataSource = new MatTableDataSource(this.messages);
        this.dataSource.paginator = this.paginator;

        // Case Insensitive Sort
        this.dataSource.sortingDataAccessor = ((data, sortHeaderId) => {
          if (typeof data[sortHeaderId] == 'string') {
            return data[sortHeaderId].toString().toLowerCase();
          }
          else {
            return data[sortHeaderId];
          }
        });

        this.dataSource.sort = this.sort;

        // Filter Predicate
        this.dataSource.filterPredicate = function (data, filter: string): boolean {
          let searchParams = JSON.parse(filter);
          if (data[searchParams.key] != null) {
            return data[searchParams.key].toLowerCase().includes(searchParams.value);
          }

        };

        // Filter columns
        let temp = {};
        let filterCol = $('#filterColumn').val();
        let filterVal = $('#filterValue').val();
        if (filterCol != 'null' && filterVal != '' && filterCol != undefined && filterVal !==undefined) {
          temp['key'] = filterCol;
          temp['value'] = filterVal.toString().toLowerCase();
          temp['filterType'] = '';
        }

        if (temp['filterType'] != undefined) {
          console.log(temp);
          this.dataSource.filter = JSON.stringify(temp);
        }
      },
      err => {
        this.showLoader = false;
        this.commonService.openSnackBar('Message Load Failed', 'badge-danger');
        console.log("Error occured");
      }
    );
  }

  updateMessageStatus(messageId: any, messageStatus: String) {

    this.messageService.updateMessageStatus(messageId, messageStatus).subscribe(
      res => {
        console.log(res);
        this.commonService.openSnackBar("Status Updated Successfully", 'badge-success');
        this.ngOnInit();
      },
      err => {
        this.commonService.openSnackBar('Status Update Failed', 'badge-danger');
        console.log("Error occured");
      }
    );
  }

  deleteMessage(messageId: any) {
    this.showLoader = true;
    console.log(messageId);
    this.messageService.deleteMessage(messageId).subscribe(
      res => {
        this.showLoader = false;
        this.commonService.openSnackBar('Message Deleted Successfully', 'badge-success');
        this.ngOnInit();
      },
      err => {
        this.showLoader = false;
        this.commonService.openSnackBar('Message Deletion Failed', 'badge-danger');
      }
    );
  }
  public handleRefresh(){
  
    this.showLoader = true;  
    let dateFilter = $('#dateFilter').val();
    if(dateFilter == 'CUSTOM' ){
      this.loadAllMessages( this.startdate, this.enddate,null);

    } else{
      this.loadAllMessages( null,null,dateFilter);
    }
    
  }


  applyFilter() {
    let dateFilter = $('#dateFilter').val();

    if (dateFilter != 'null') {
      /*   temp['filterType'] = 'onlyDate';
        temp['endDate'] = this.getEndDate();
        temp['startDate'] = this.getStartDate(+dateFilter); */
      if (dateFilter == 'CUSTOM') {
        this.startdate = $('#startDate').val();
         this.enddate = $('#endDate').val();
        if (this.startdate == '' || this.enddate == '') {
          this.commonService.openSnackBar('Date Fields are mandatory for Custom filter', 'badge-danger');
          return;
        }
        this.loadAllMessages(this.startdate, this.enddate, null);
      } else {
        this.loadAllMessages(null, null, dateFilter);
      }
    }

  }

  getStartDate(days: number) {
    if (days == 0) {
      let date = new Date();
      date.setHours(0, 0, 0, 0);
      return new Date(date);
    }
    else {
      let date = new Date(new Date().setDate(new Date().getDate() - days));
      date.setHours(0, 0, 0, 0);
      return date;
    }
  }

  getEndDate() {

    let date = new Date();
    date.setHours(24, 0, 0, 0);
    return new Date(date);

  }


  resetFilter() {
    CommonService.resetPage(this.router);
  }

  openPopOver(popover, messageId: number) {
    if (!popover.isOpen()) {
      popover.open({ messageId });
    }
  }

  filterChange(value: any) {
    if (value == 'CUSTOM') {
      this.disableDate = false;
    }
    else {
      this.disableDate = true;
    }
  }

  startDateChange(value: Date) {
    let year: number = value.getFullYear();
    let month: number = value.getMonth();
    let day: number = value.getDay() + 1;

    let startDate: Date = new Date(year, month, day);
    this.minEndDate = startDate;

    let temp: Date = new Date(year, month, day);
    temp.setDate(temp.getDate() + 90);
    if (temp > new Date()) {
      temp = new Date();
    }
    this.maxEndDate = temp;

  }

}

