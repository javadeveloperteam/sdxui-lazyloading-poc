import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource, MatTable } from '@angular/material';
import { CommonService } from 'src/app/common/services/common.service';
import { Router } from '@angular/router';
import { SelectionModel } from '@angular/cdk/collections';
import { VERSION, MatDialogRef, MatDialog, MatSnackBar, MAT_DIALOG_DATA } from '@angular/material';
import { UsersService } from 'src/app/index/content/users/services/users.service';

@Component({
  selector: 'app-contact-dialog',
  templateUrl: './contact-dialog.component.html',
  styleUrls: ['./contact-dialog.component.css']
})
export class ContactDialogComponent implements OnInit {
  closeDialog: boolean = true
  selection = new SelectionModel<any>(false);

  activeAssetPopup: boolean = false
  matchecked: boolean = false;
  dataSource: MatTableDataSource<any>;
  showLoader: Boolean = false;
  locations: any = [];
  displayedColumns: any = []
  locData: any
  contactdialogData: any;
  users: any;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatTable, { static: true }) table: MatTable<any>;
  contactData: any;
  arrayContactData: any = [];


  constructor(private dialogRef: MatDialogRef<any>, private usersService: UsersService, private router: Router,
    private commonService: CommonService) { }


  ngOnInit() {
    this.displayedColumns = ['select', 'userName', 'emailId','active'];

    this.activeAssetPopup = true;
    this.usersService.getAllUsers().subscribe(
      res => {
        this.showLoader = false;
        console.log(res);
        this.users = res;
        this.dataSource = new MatTableDataSource(this.users);

        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.dataSource.filterPredicate = function (data, filter: string): boolean {
          return data.userName.toLowerCase().includes(filter);
        };
        this.contactData = JSON.parse(localStorage.getItem('contactData'))
        this.arrayContactData.push(this.contactData)
        if (this.contactData !== 'undefined' && this.contactData !== 'null' && this.contactData !== "") {
          for (let i = 0; i < this.arrayContactData.length; i++) {
            this.dataSource.data.forEach(row => {
              // for(let j = 0; j < this.dataSource.data.length; j++){
              if (row.userId == this.arrayContactData[i].userId) {
                this.selection.select(row);
                this.contactdialogData = row;
                this.usersService.setContactData(this.contactdialogData);
              }
            })
          }
        }
      },
      err => {
        this.showLoader = false;
        this.commonService.openSnackBar('User Load Failed', 'badge-danger');
        console.log("Error occured");
      }
    );

  }
  checkSelection(value, rowItem) {
    this.matchecked = !value;
    if (this.matchecked == true) {
      this.contactdialogData = rowItem
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
  select() {
    if (this.selection.selected.length == 1) {

      this.usersService.setContactData(this.contactdialogData);
      localStorage.setItem('contactData', JSON.stringify(this.contactdialogData))
      this.dialogRef.close(ContactDialogComponent);
    } else {
      this.commonService.openSnackBar('Please select one user', 'badge-danger');
    }
  }
  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }
  clear(){
    this.selection.clear();
    this.usersService.setContactData({});
  }
}
