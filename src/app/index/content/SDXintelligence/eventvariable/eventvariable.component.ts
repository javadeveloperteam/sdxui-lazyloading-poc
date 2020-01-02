import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource, MatTable, MatDialog } from '@angular/material';
import { Router } from "@angular/router";
import { CommonService } from 'src/app/common/services/common.service';
import { EventVariableService } from "../eventvariable/services/eventvariable.service";
import { AlertPopupComponent } from '../../users/modal/alert-popup/alert-popup.component';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-eventvariable',
  templateUrl: './eventvariable.component.html',
  styleUrls: ['./eventvariable.component.css']
})
export class EventvariableComponent implements OnInit {

  showLoader: Boolean = false;
  variables: any;
  displayedColumns = ['variableName','eventName', 'applicationName', 'Action'];
  dataSource: MatTableDataSource<any>;
 

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatTable, { static: true }) table: MatTable<any>;

  constructor(
    private router: Router,
    private eventVariableService: EventVariableService,
    private commonService: CommonService ,
    public dialog: MatDialog) {
  }

  ngOnInit() {
    this.showLoader = true;
    this.eventVariableService.getAllVariables().subscribe(
      res => {
        this.showLoader = false;
        console.log(res);
        //this.commonService.openSnackBar("Department Loaded Successfully", 'badge-success');

        this.variables = res;
        this.dataSource = new MatTableDataSource(this.variables);
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
          return data.variableName.toLowerCase().includes(filter);
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

  deleteVariable(eventId: any, variableId: any, variableName:any) {
    const dialogRef = this.dialog.open(AlertPopupComponent, {
      disableClose: true, data: {
          type: "submit",
          content: 'Variable <b>"' + variableName + '"</b> will be Removed Permanently. Do you want to Proceed ?',
          component:'eventVarible'
      }
  });
  dialogRef.afterClosed().subscribe(result => {
    if ( dialogRef.componentInstance.isDelete == true ) {
    this.showLoader = true;
    console.log(eventId);
    this.eventVariableService.deleteEventVariable(eventId,variableId).subscribe(
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
        
       
      });
  }
 
  editVariable(applicationId:any, eventId : any, variableId: any) {
    this.showLoader = true;
    this.router.navigate(['index/sdxintelligence/applications/editEventVariable']);
    localStorage.setItem("applicationId", applicationId);
    localStorage.setItem("variableId", variableId);
    localStorage.setItem("eventId", eventId);
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }

}
