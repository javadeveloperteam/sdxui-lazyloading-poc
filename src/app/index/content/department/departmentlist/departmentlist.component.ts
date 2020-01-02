import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource, MatTable, MatDialog } from '@angular/material';
import { Router } from "@angular/router";
import { CommonService } from 'src/app/common/services/common.service';
import { DepartmentService } from "../services/department.service";
import { AlertPopupComponent } from '../../users/modal/alert-popup/alert-popup.component';
import { UserDeptPopupComponent } from "../../dialog/user-dept-popup/user-dept-popup.component";
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-departmentlist',
  templateUrl: './departmentlist.component.html',
  styleUrls: ['./departmentlist.component.css']
})
export class DepartmentlistComponent implements OnInit {

  showLoader: Boolean = false;
  departments: any;
  displayedColumns = [ 'departmentName', 'supervisorName', 'users','active', 'action'];
  dataSource: MatTableDataSource<any>;

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatTable, { static: true }) table: MatTable<any>;

  constructor(
    private router: Router,
    private departmentService: DepartmentService,
    private commonService: CommonService,
    public dialog: MatDialog) {
  }

  ngOnInit() {
    this.showLoader = true;
    this.departmentService.getAllDepartment().subscribe(
      res => {
        this.showLoader = false;
        console.log(res);
        //this.commonService.openSnackBar("Department Loaded Successfully", 'badge-success');

        this.departments = res;
        this.dataSource = new MatTableDataSource(this.departments);
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
          return data.departmentName.toLowerCase().includes(filter);
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
        this.commonService.openSnackBar('Department Load Failed', 'badge-danger');
        console.log("Error occured");
      }
    );
  }

  deleteDepartment(departmentId: any, departmentName: any) {
    const dialogRef = this.dialog.open(AlertPopupComponent, {
      disableClose: true, data: {
          type: "submit",
          component:'department',
          content: 'Department <b>"' + departmentName + '"</b> will be Removed Permanently. Do you want to Proceed ?'
      }
  });
  dialogRef.afterClosed().subscribe(result => {
    if ( dialogRef.componentInstance.isDelete == true ) {
    this.showLoader = true;
    console.log(departmentId);
    this.departmentService.deleteDepartment(departmentId).subscribe(
      res => {
        this.showLoader = false;
        this.commonService.openSnackBar('Department - ' + departmentName + ' Deleted Successfully', 'badge-success');
        this.ngOnInit();
      },
      err => {
        this.showLoader = false;
        this.commonService.openSnackBar('Department Deletion Failed', 'badge-danger');
      }
    );
          }
        
      });
  }
  statusUpdate(department :any)
  {
    // update contact
    department.active = !department.active;
    this.updateDepartment(department);
  }

  updateDepartment(department) {
   
    this.showLoader = true;
    this.departmentService.updateDepartment(department).subscribe(
      res => {
        console.log(res);
        this.showLoader = false;
        this.commonService.openSnackBar("Department Updated Successfully", 'badge-success');
        this.router.navigate(['index/departments']);
      },
      err => {
        this.showLoader = false;
        console.log("Error occured");
        console.log(err);
        this.commonService.openSnackBar('Department Update Failed : '+err.error.message, 'badge-danger');
      }
    );
  }
  editDepartment(departmentId: any) {
    this.showLoader = true;
    this.router.navigate(['index/departments/edit']);
    localStorage.setItem("departmentId", JSON.stringify(departmentId));
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }

  showUserInfo(departmentId)
  {
    const dialogRef = this.dialog.open(UserDeptPopupComponent, { disableClose: true,data: {
			departmentId:departmentId}
		 });
  }
}
