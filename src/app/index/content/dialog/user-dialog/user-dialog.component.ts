import { Component, OnInit, ViewEncapsulation, ViewChild, Inject  } from '@angular/core';
import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { Router } from "@angular/router";
import { UsersService } from "../../users/services/users.service";
import { MatPaginator, MatSort, MatTableDataSource, MatTable } from '@angular/material';
import { CommonService } from 'src/app/common/services/common.service';
import { SelectionModel } from '@angular/cdk/collections';
import { MatDialogRef,MAT_DIALOG_DATA  } from '@angular/material/dialog';

@Injectable()
@Component({
    selector: 'app-user-dialog',
    templateUrl: './user-dialog.component.html',
    styleUrls: ['./user-dialog.component.css'],
    encapsulation: ViewEncapsulation.None
})
export class UserDialogComponent implements OnInit {

    users: any;
    displayedColumns = ['select', 'userName', 'active', 'createdByName'];
    selection = new SelectionModel<any>(true, []);
    dataSource: MatTableDataSource<any>;
    checkAll = false;
    selectedUsers = [];
    showLoader: Boolean;
    singleselect : any;

    constructor(
        private http: HttpClient,
        private router: Router,
        public dialogRef: MatDialogRef<UserDialogComponent>,
        private userService: UsersService,
        private commonService: CommonService,
        @Inject(MAT_DIALOG_DATA) public data: any) {
    }

    @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
    @ViewChild(MatSort, { static: true }) sort: MatSort;
    @ViewChild(MatTable, { static: true }) table: MatTable<any>;

    ngOnInit() {
        let addedUsersStr = localStorage.getItem("selectedUsers");
        let roleName = null;
        let departmentId = null;
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
                this.dataSource = new MatTableDataSource(this.users);
                this.dataSource.paginator = this.paginator;
                this.dataSource.sort = this.sort;
                this.dataSource.filterPredicate = function (data, filter: string): boolean {
                    return data.userName.toLowerCase().includes(filter);
                };

                // Enable Already Selected Fields
                console.log(addedUsersStr);
                    if (this.data != undefined && this.data.type == "singleselect") {
                        this.singleselect = true;
                        this.selection = new SelectionModel<any>(false,[]);
                        this.selectedUsers.push(JSON.parse(addedUsersStr))
                    }else{
                        this.singleselect = false;
                        this.selection = new SelectionModel<any>(true, []);
                        this.selectedUsers = JSON.parse(addedUsersStr);
                    }

                    if (addedUsersStr != 'undefined' && addedUsersStr != 'null') {
                    for (let i = 0; i < this.selectedUsers.length; i++) {
                        this.dataSource.data.forEach(row => {
                            if (row.userId == this.selectedUsers[i].userId) {
                                this.selection.select(row)
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

    loadAllUsers()
    {

    }
    applyFilter(filterValue: string) {
        filterValue = filterValue.trim(); // Remove whitespace
        filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
        this.dataSource.filter = filterValue;
    }
    isAllSelected() {
        const numSelected = this.selection.selected.length;
        const numRows = this.dataSource.data.length;
        return numSelected == numRows;
    }

    /** Selects all rows if they are not all selected; otherwise clear selection. */
    masterToggle() {
        this.isAllSelected() ?
            this.selection.clear() :
            this.dataSource.data.forEach(row => this.selection.select(row));
    }

    select()
    {
        this.selectedUsers = this.selection.selected;
        console.log(this.selection.selected);
        if( this.selection.selected.length>=1){
            this.close();
       }else{
           this.commonService.openSnackBar('Please select atleast one user', 'badge-danger');
        }
    }

    close()
    {
        this.dialogRef.close();
    }

    clear(){        
        this.selection.clear()
        this.selectedUsers = this.selection.selected;
    }
}
