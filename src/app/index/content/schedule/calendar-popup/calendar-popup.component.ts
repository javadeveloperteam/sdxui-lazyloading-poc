import { Component, OnInit, Inject, ViewChild, ViewEncapsulation } from '@angular/core';
import { MAT_DIALOG_DATA, MatTableDataSource, MatPaginator, MatSort, MatTable } from '@angular/material';

@Component({
  selector: 'app-calendar-popup',
  templateUrl: './calendar-popup.component.html',
  styleUrls: ['./calendar-popup.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class CalendarPopupComponent implements OnInit {
  calendarData: any = []
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
  constructor(@Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {
    this.displayedColumns = ['title', "occurrenceType", "startDate", "endDate"]
    this.calendarData = this.data.calenderData;
    for (let i = 0; i < this.calendarData.length; i++) {
      this.calendarData[i] = {
        startDate: this.calendarData[i].dispStartDate,
        endDate: this.calendarData[i].dispEndDate,
        title: this.calendarData[i].title,
        occurrenceType: this.calendarData[i].type
      }
    }
    this.dataSource = new MatTableDataSource(this.calendarData);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.dataSource.filterPredicate = function (data, filter: string): boolean {
      return data.scheduleName.toLowerCase().includes(filter);
    };
  }

}
