import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatPaginator, MatSort, MatTable, MatTableDataSource } from '@angular/material';
import { ScheduleService } from '../services/schedule.service';

@Component({
  selector: 'app-day-calender-pop-up',
  templateUrl: './day-calender-pop-up.component.html',
  styleUrls: ['./day-calender-pop-up.component.css']
})
export class DayCalenderPopUpComponent implements OnInit {
  schedule:any = {};
  displayedColumns: any = []
  dataSource: MatTableDataSource<any>;
  
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatTable, { static: true }) table: MatTable<any>;
  startSplit: string;
  endSplit: string;
  startDate: string;
  startTime: string;
  endDate: string;
  endTime: string;
  arrayDate: any = [];
  constructor( @Inject(MAT_DIALOG_DATA) public data: any,private scheduleService: ScheduleService) { }

  ngOnInit() {
  this.displayedColumns = ["schedule","userName","groupName","entity","occurrenceType","startDate", "endDate",'scheduleTime']
   
    this.scheduleService.getSchedule(this.data.calenderData.id).subscribe(
      res => {
        this.schedule = res;   
        if(this.schedule.scheduleDetails.length > 0)
        {
          this.schedule['startDate'] = this.schedule.scheduleDetails[0].startDate;
          this.schedule['endDate'] = this.schedule.scheduleDetails[0].endDate;
          this.schedule['intervalDay'] = this.schedule.scheduleDetails[0].intervalDay;
          this.schedule['scheduleTime'] = this.schedule.scheduleDetails[0].scheduleTime;  
          this.schedule['occurrenceType'] = this.schedule.scheduleDetails[0].occurrenceType;           
        }     
        
        this.dataSource = new MatTableDataSource(this.schedule.scheduleDetails);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.dataSource.filterPredicate = function (data, filter: string): boolean {
          return data.scheduleName.toLowerCase().includes(filter);
        };
      }
    );
    
  }

}
