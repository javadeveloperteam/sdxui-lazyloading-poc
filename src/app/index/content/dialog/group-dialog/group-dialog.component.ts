import { Component, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { Injectable } from "@angular/core";
import { GroupService } from "../../group/services/group.service";
import { MatPaginator, MatSort, MatTableDataSource, MatTable } from '@angular/material';
import { CommonService } from 'src/app/common/services/common.service';
import { SelectionModel } from '@angular/cdk/collections';
import { MatDialogRef } from '@angular/material/dialog';

@Injectable()
@Component({
    selector: 'app-group-dialog',
    templateUrl: './group-dialog.component.html',
    styleUrls: ['./group-dialog.component.css'],
    encapsulation: ViewEncapsulation.None
})
export class GroupDialogComponent implements OnInit {

    groups: any;
    displayedColumns = ['select', 'groupId', 'groupName', 'active', 'type', 'createdByName'];
    selection = new SelectionModel<any>(true, []);
    dataSource: MatTableDataSource<any>;
    checkAll = false;
    showLoader: Boolean;
    selectedGrps: any;

    constructor(
        public dialogRef: MatDialogRef<GroupDialogComponent>,
        private groupService: GroupService,
        private commonService: CommonService) {
    }

    @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
    @ViewChild(MatSort, { static: true }) sort: MatSort;
    @ViewChild(MatTable, { static: true }) table: MatTable<any>;

    ngOnInit() {
        let addedGrpsStr = localStorage.getItem("selectedGroups");
        let groupType = localStorage.getItem("groupType");
        let groupId = localStorage.getItem("groupId");
        
        this.showLoader = true;
        console.log(groupType);
        this.groupService.getAllGroups().subscribe(
            res => {
                this.showLoader = false;
                this.groups = res;                
                for(let i = 0 ; i < this.groups.length ; i++)
                {
                    if(this.groups[i].groupId = groupId){
                        this.groups.splice(i,1);
                    }
                }
                this.dataSource = new MatTableDataSource(this.groups);
                this.dataSource.paginator = this.paginator;
                this.dataSource.sort = this.sort;
                this.dataSource.filterPredicate = function (data, filter: string): boolean {
                    return data.groupName.toLowerCase().includes(filter);
                };

                // Enable Already Selected Fields
                console.log(addedGrpsStr);
                if (addedGrpsStr != 'undefined' && addedGrpsStr != 'null') {
                    this.selectedGrps = JSON.parse(addedGrpsStr);
                    for (let i = 0; i < this.selectedGrps.length; i++) {
                        this.dataSource.data.forEach(row => {
                            if (row.groupId == this.selectedGrps[i].groupId) {
                                this.selection.select(row)
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
        this.showLoader = false;
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
        this.selectedGrps = this.selection.selected;
        console.log(this.selection.selected);
        if( this.selection.selected.length>=1){
            this.close();
       }else{
           this.commonService.openSnackBar('Please select atleast one group', 'badge-danger');
        }
    }

    close()
    {
        this.dialogRef.close();
    }
    clear(){
        this.selection.clear()
    }
}
