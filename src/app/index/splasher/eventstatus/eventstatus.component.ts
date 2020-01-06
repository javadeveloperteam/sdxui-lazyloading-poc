import { Component, OnInit, ViewChild, AfterViewInit, ChangeDetectorRef, ViewEncapsulation } from '@angular/core';
import { MatPaginator, MatSort, MatTable, MatTableDataSource, MatDialog, MatDialogConfig } from '@angular/material';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { EventStatusService, EventRecord } from './service/event-status.service';
import { CommonService } from 'src/app/common/services/common.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import {animate, state, style, transition, trigger} from '@angular/animations';
import { EventRecordViewComponent } from './event-record-view/event-record-view.component';
import { NONE_TYPE } from '@angular/compiler/src/output/output_ast';

@Component({
  selector: 'app-eventstatus',
  templateUrl: './eventstatus.component.html',
  styleUrls: ['./eventstatus.component.css'],
  encapsulation:ViewEncapsulation.None,
})
export class EventstatusComponent implements OnInit,AfterViewInit {

  showLoader: Boolean = false;
  events: EventRecord[];
  displayedColumns = [ 'applicationName', 'eventName', 'assetName', 'createdOn', 'eventStatus', 'info'];
  dataSource: MatTableDataSource<any>;
  searchForm: FormGroup;
  interval: any;
  todayDate: any;
  disableDate: any = true;
  minEndDate: any;
  maxEndDate: any;
  
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatTable, { static: true }) table: MatTable<any>;
  startdate: any;
  enddate:any;
    
  constructor(
      private router: Router,
      private eventsStatusService: EventStatusService,
      private formBuilder: FormBuilder,
      private commonService: CommonService,
      private dialog: MatDialog) {
        
      this.searchForm = this.formBuilder.group({
          filterColumn: [''],
          filterValue: [''],
          filterRange: ['']         
      });
  }

  ngOnInit() {
      this.showLoader = true;
      this.todayDate = new Date();
      
      // this.loadEventRecords();
     /*  this.interval = setInterval(() => { 
         this.handleRefresh();
      }, 60000); */ // set interval to 60s
      let date = new Date();
      date.setDate(date.getDate() - 90);
      this.minEndDate = date;
      this.maxEndDate = this.todayDate;
      $('#dateFilter').val('LAST_ONE_WEEK');
      this.loadEventRecordsBySearch(null, null, 'LAST_ONE_WEEK');
  }

  ngAfterViewInit() {
    console.log('Hello '); 
  }


  applyFilter(filterValue: string) {
      filterValue = filterValue.trim(); // Remove whitespace
      filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
      this.dataSource.filter = filterValue;
  }

  public handleRefresh(){
    console.log('handle refresh event');
    this.showLoader = true;  
    let dateFilter = $('#dateFilter').val();
    if(dateFilter == 'CUSTOM' ){
      this.loadEventRecordsBySearch( this.startdate, this.enddate,null);

    } else{
      this.loadEventRecordsBySearch( null,null,dateFilter);
    }
    
  }


  public viewEventRecord(row: any) {
    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = false;
    dialogConfig.autoFocus = true;
    dialogConfig.height = '450px';
    dialogConfig.width = '1000px';
    dialogConfig.data = {
        recordId: row['eventRecordId']     
    };
    const dialogRef = this.dialog.open(EventRecordViewComponent, dialogConfig);
  }

  public get f() { return this.searchForm.controls; }

  public search(): void { 
    let dateFilter = $('#dateFilter').val();

    if (dateFilter != 'null') {
      /*   temp['filterType'] = 'onlyDate';
        temp['endDate'] = this.getEndDate();
        temp['startDate'] = this.getStartDate(+dateFilter); */
      if (dateFilter == 'CUSTOM') {
        this.startdate = $('#startDate').val();
        this.enddate = $('#endDate').val();
        if (  this.startdate == '' ||   this.enddate == '') {
          this.commonService.openSnackBar('Date Fields are mandatory for Custom filter', 'badge-danger');
          return;
        }
        this.loadEventRecordsBySearch(  this.startdate,   this.enddate, null);
      } else {
        this.loadEventRecordsBySearch(null, null, dateFilter);
      }
    }
  
    //  this.loadEventRecordsBySearch(this.searchForm.value);
  }

  public loadEventRecordsBySearch(startDate: any, endDate: any, dateFilter: any){
    this.showLoader = true;
    this.eventsStatusService
      .getEventRecordsBySearch(startDate, endDate, dateFilter)
      .subscribe( res => {
        this.showLoader = false;
        console.log(res);
        this.events = res;
        this.dataSource = new MatTableDataSource(this.events);
        this.dataSource.paginator = this.paginator;

        // Case insensitive sort
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

      }, err => {
        this.showLoader = false;
        this.commonService.openSnackBar('Event Records Fetch Failed', 'badge-danger');
        console.log("Error occured");
      });
  }

  public onChange(event: any): void {
    console.log(event);
    
  }

  public onQuickFilterChange(event: any): void {
    console.log('on quick filter change');
    if (event == 'CUSTOM') {
      this.disableDate = false;
    }
    else {
      this.disableDate = true;
    }
  }

  public reset(): void {
    // this.searchForm.reset();
    CommonService.resetPage(this.router);
  }

  public loadEventRecords(){
    this.eventsStatusService.getEventRecords().subscribe(
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
            
        },
        err => {
            this.showLoader = false;
            this.commonService.openSnackBar('Event Records Fetch Failed', 'badge-danger');
            console.log("Error occured");
        }
    );
  }

  // for Date picker
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
