import { Component, OnInit, Injectable, Inject, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource, MatTable } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';
import { GroupService } from "../../group/services/group.service";
import { UsersService } from "../../users/services/users.service";
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { CommonService } from 'src/app/common/services/common.service';

@Injectable()
@Component({
  selector: 'app-user-group-dialog',
  templateUrl: './user-group-dialog.component.html',
  styleUrls: ['./user-group-dialog.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class UserGroupDialogComponent implements OnInit {

  groups: any;
  users: any;
  groupDisplayedColumns = ['select', 'groupName', 'active', 'createdByName'];
  userDisplayedColumns = ['select', 'userName', 'active', 'createdByName'];
  groupSelection = new SelectionModel<any>(true, []);
  userSelection = new SelectionModel<any>(true, []);
  groupDataSource: MatTableDataSource<any>;
  userDataSource: MatTableDataSource<any>;
  checkAll = false;
  showLoader: Boolean;
  selectedGrps: any;
  selectedUsers: any;
  tabName: string;

  @ViewChild('MatPaginatorGrp', { static: true }) matPaginatorGrp: MatPaginator;
  @ViewChild('MatPaginatorUser', { static: true }) matPaginatorUser: MatPaginator;
  @ViewChild('matSortGrp', { static: true }) matSortGrp: MatSort;
  @ViewChild('matSortUser', { static: true }) matSortUser: MatSort;
  @ViewChild(MatTable, { static: true }) table: MatTable<any>;

  constructor(
    public dialogRef: MatDialogRef<UserGroupDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private groupService: GroupService,
    private userService: UsersService,
    private commonService: CommonService
  ) { }

  ngOnInit() {
    this.loadGroups();
    this.loadUsers();
    this.showLoader = false;
  }

  loadGroups() {
    let addedGrpsStr = localStorage.getItem("selectedGroups");
    this.showLoader = true;

    this.groupService.getAllGroups().subscribe(
      res => {
        this.showLoader = false;
        this.groups = res;
        let temp = [];

        if (this.data != undefined && this.data.screen != undefined && this.data.screen == 'Group') {
          this.groups.forEach(element => {
            if (element.groupId != this.data.hideId) {
              temp.push(element);
            }
          });
          this.groups = temp;
        }

        this.groupDataSource = new MatTableDataSource(this.groups);
        this.groupDataSource.paginator = this.matPaginatorGrp;
        this.groupDataSource.sort = this.matSortGrp;
        this.groupDataSource.filterPredicate = function (data, filter: string): boolean {
          return data.groupName.toLowerCase().includes(filter);
        };

        // Enable Already Selected Fields
        console.log(addedGrpsStr);
        if (addedGrpsStr != 'undefined' && addedGrpsStr != 'null') {
          this.selectedGrps = JSON.parse(addedGrpsStr);
          for (let i = 0; i < this.selectedGrps.length; i++) {
            this.groupDataSource.data.forEach(row => {
              if (row.groupId == this.selectedGrps[i].groupId) {
                this.groupSelection.select(row)
              }
            });
          }
        }
      },
      err => {
        this.showLoader = false;
        this.commonService.openSnackBar('Group Load Failed', 'badge-danger');
        console.log("Error occured");
      }
    );

    this.tabName = 'GROUP'
  }

  loadUsers() {
        let addedUsersStr = localStorage.getItem("selectedUsers");
        let roleName = null;
        let departmentId = null;
        this.showLoader = true;
        if(this.data != undefined && this.data.roleName != undefined)
        {
            roleName = this.data.roleName;   
        }
        if(this.data != undefined && this.data.departmentId != undefined)
        {
            departmentId = this.data.departmentId;   
        }
        this.showLoader = true;
        this.userService.getAllUsersByRoleNameAndDepartmentId(departmentId,roleName).subscribe(
            res => {
                this.showLoader = false;
                this.users = res;
                this.userDataSource = new MatTableDataSource(this.users);
                this.userDataSource.paginator = this.matPaginatorUser;
                this.userDataSource.sort = this.matSortUser;
                this.userDataSource.filterPredicate = function (data, filter: string): boolean {
                    return data.userName.toLowerCase().includes(filter);
                };

                // Enable Already Selected Fields
                console.log(addedUsersStr);
                this.selectedUsers = JSON.parse(addedUsersStr);
                    if (addedUsersStr != 'undefined' && addedUsersStr != 'null') {
                    for (let i = 0; i < this.selectedUsers.length; i++) {
                        this.userDataSource.data.forEach(row => {
                            if (row.userId == this.selectedUsers[i].userId) {
                                this.userSelection.select(row)
                            }
                        });
                    }
                }
            },
            err => {
                this.showLoader = false;
                this.commonService.openSnackBar('User Load Failed', 'badge-danger');
                console.log("Error occured");
            }
        );
        this.showLoader = false;
  }

  applyFilterGroup(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    this.groupDataSource.filter = filterValue;
  }

  applyFilterUser(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    this.userDataSource.filter = filterValue;
  }

  isAllGroupSelected() {
    const numSelected = this.groupSelection.selected.length;
    const numRows = this.groupDataSource.data.length;
    return numSelected == numRows;
  }

  isAllUsersSelected() {
    const numSelected = this.userSelection.selected.length;
    const numRows = this.userDataSource.data.length;
    return numSelected == numRows;
  }

  masterToggleGroup() {
    this.isAllGroupSelected() ?
      this.groupSelection.clear() :
      this.groupDataSource.data.forEach(row => this.groupSelection.select(row));
  }

  masterToggleUser() {
    this.isAllUsersSelected() ?
      this.userSelection.clear() :
      this.userDataSource.data.forEach(row => this.userSelection.select(row));
  }

  tabClick(tabName) {
    this.tabName = tabName
  }

  select() {
    this.selectedGrps = this.groupSelection.selected;
    this.selectedUsers = this.userSelection.selected;

    if (this.selectedGrps.length >= 1 || this.selectedUsers.length >= 1) {
      this.close();
    } else {
      this.commonService.openSnackBar('Please select atleast one entity', 'badge-danger');
    }
  }

  close() {
    this.dialogRef.close();
  }

  clear() {
    if (this.tabName == 'GROUP') {
      this.groupSelection.clear()
    } else if (this.tabName == 'DESTINATION') {
      this.userSelection.clear()
    }

    this.selectedGrps = this.groupSelection.selected;
    this.selectedUsers = this.userSelection.selected;

  }

}
