import { Component, OnInit, Inject, ViewChild, ViewEncapsulation } from '@angular/core';
import { MAT_DIALOG_DATA, MatTableDataSource, MatPaginator, MatSort, MatTable } from '@angular/material';
import { DepartmentService } from "../../department/services/department.service";

@Component({
  selector: 'app-user-dept-popup',
  templateUrl: './user-dept-popup.component.html',
  styleUrls: ['./user-dept-popup.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class UserDeptPopupComponent implements OnInit {
  calendarData: any = []
  displayedColumns: any = ['userName', "employeeId","departmentName", "active"];
  dataSource: MatTableDataSource<any>;
  department: any;
  showLoader = false;


  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatTable, { static: true }) table: MatTable<any>;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
  private departmentService : DepartmentService) { }

  ngOnInit() {
    this.showLoader = true;
    let departmentId = null;
    if(this.data != undefined && this.data.departmentId != undefined)
    {
      departmentId = this.data.departmentId;
    }

    if(departmentId != null)
    {
      this.getDepartment(departmentId);
    }
    else
    {
      this.showLoader = false;
    }
  }

  getDepartment(departmentId: any) {
    this.departmentService.getDepartment(departmentId).subscribe(
      res => {
        console.log(res);
        this.showLoader = false;
        this.department = res;
        this.dataSource = new MatTableDataSource(this.department.users);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.dataSource.filterPredicate = function (data, filter: string): boolean {
          return data.userName.toLowerCase().includes(filter);
        };

      },
      err => {
        console.log("Error occured");
        console.log(err);
      }
    );
  }

}
