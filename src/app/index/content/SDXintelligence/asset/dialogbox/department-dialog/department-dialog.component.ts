import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource, MatTable } from '@angular/material';
import { CommonService } from 'src/app/common/services/common.service';
import { Router } from '@angular/router';
import { SelectionModel } from '@angular/cdk/collections';
import { VERSION, MatDialogRef, MatDialog, MatSnackBar, MAT_DIALOG_DATA } from '@angular/material';
import { LocationsService } from '../../../location/services/locations.service';
import { DepartmentService } from 'src/app/index/content/department/services/department.service';

@Component({
  selector: 'app-department-dialog',
  templateUrl: './department-dialog.component.html',
  styleUrls: ['./department-dialog.component.css']
})
export class DepartmentDialogComponent implements OnInit {
  closeDialog:boolean = true
  selection = new SelectionModel<any>(false);

  activeAssetPopup:boolean = false
  matchecked: boolean = false;
  dataSource: MatTableDataSource<any>;
  showLoader: Boolean = false;
  displayedColumns:any = []
  departmentdialogData: any;
  departments: any;

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatTable, { static: true }) table: MatTable<any>;
  departmentData: any  = []
  arrayDepartmentData: any = [];
  departmentData1: any = [];
  selectDepartment: any =[];
 

  constructor( private dialogRef: MatDialogRef<any>,private departmentService: DepartmentService,
     private locationService:LocationsService, private router: Router,
     private commonService: CommonService) { }


  ngOnInit() {
    this.activeAssetPopup = true;
    this.displayedColumns = ['select', 'departmentName', 'active', 'createdBy'];

    this.departmentService.getAllDepartment().subscribe(
      res => {
        this.showLoader = false;
        console.log(res);
        //this.commonService.openSnackBar("Department Loaded Successfully", 'badge-success');

        this.departments = res;
        this.dataSource = new MatTableDataSource(this.departments);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.dataSource.filterPredicate = function (data, filter: string): boolean {
          return data.departmentName.toLowerCase().includes(filter);
        };

        this.departmentData = JSON.parse(localStorage.getItem('departmentData'))
        this.arrayDepartmentData.push( this.departmentData)
        if ( this.departmentData  !== 'undefined' &&  this.departmentData  !== 'null' && this.departmentData  !== "" ) {
          for (let i = 0; i < this.arrayDepartmentData.length; i++) {
              this.dataSource.data.forEach(row => {
                  if (row.departmentId == this.arrayDepartmentData[i].departmentId) {
                      this.selection.select(row)
                      this.departmentdialogData = row;
                      this.departmentService.setDepartmentData(this.departmentdialogData);
                  }
                })
              }
             }
      },
      err => {
        this.showLoader = false;
        this.commonService.openSnackBar('Department Load Failed', 'badge-danger');
        console.log("Error occured");
      }
    );
    
  }
  checkSelection(value,rowItem){
    this.matchecked = !value;
    if( this.matchecked == true){
      this.departmentdialogData = rowItem
    }else{
      this.departmentdialogData = undefined
    }

   
  }
  masterToggle() {
    this.isAllSelected() ?
        this.selection.clear() :
        this.dataSource.data.forEach(row => this.selection.select(row));
       
}
isAllSelected() {
  const numSelected = this.selection.selected.length;
  const numRows = this.dataSource.data.length;
  return numSelected == numRows;
}
select(){
  this.selectDepartment = this.selection.selected
  if(this.selection.selected.length == 1){
  
  this.departmentService.setDepartmentData(this.departmentdialogData);

  localStorage.setItem('departmentData',JSON.stringify(this.departmentdialogData))
  
this.dialogRef.close(DepartmentDialogComponent);
}else{
    this.commonService.openSnackBar('Please select one department', 'badge-danger');
  }
}
applyFilter(filterValue: string) {
  filterValue = filterValue.trim(); // Remove whitespace
  filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
  this.dataSource.filter = filterValue;
}
clear(){
  this.selection.clear();
  this.selectDepartment = this.selection.selected;
}
}
