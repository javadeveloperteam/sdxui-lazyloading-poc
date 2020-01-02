import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource, MatTable } from '@angular/material';
import { Router } from "@angular/router";
import { CommonService } from 'src/app/common/services/common.service';
import { MessageService } from "../notificationstatus/services/message.service";

@Component({
  selector: 'app-notificationstatus',
  templateUrl: './notificationstatus.component.html',
  styleUrls: ['./notificationstatus.component.css']
})
export class NotificationstatusComponent implements OnInit {

  showLoader: Boolean = false;
  messages: any;
  displayedColumns = ['messageId', 'message', 'type', 'messageStatus', 'configurationName', 'action'];
  dataSource: MatTableDataSource<any>;

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatTable, { static: true }) table: MatTable<any>;

  constructor(
    private router: Router,
    private messageService: MessageService,
    private commonService: CommonService) {
  }

  ngOnInit() {
    this.showLoader = true;
    this.messageService.getMessageList().subscribe(
      res => {
        this.showLoader = false;
        console.log(res);
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
  
  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }
}
