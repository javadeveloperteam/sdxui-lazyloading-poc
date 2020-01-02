import { Component, OnInit, ViewEncapsulation, ViewChild, Inject } from '@angular/core';
import { Injectable } from "@angular/core";
import { GroupService } from "../../group/services/group.service";
import { MatPaginator, MatSort, MatTableDataSource, MatTable } from '@angular/material';
import { CommonService } from 'src/app/common/services/common.service';
import { SelectionModel } from '@angular/cdk/collections';
import { DestinationService } from "../../destination/services/destination.service";
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

@Injectable()
@Component({
    selector: 'app-group-dest-dialog',
    templateUrl: './group-dest-dialog.component.html',
    styleUrls: ['./group-dest-dialog.component.css'],
    encapsulation: ViewEncapsulation.None
})
export class GroupDestDialogComponent implements OnInit {

    groups: any;
    destinations: any;
    groupDisplayedColumns = ['select',  'groupName', 'active', 'createdByName'];
    destinationDisplayedColumns = ['select',  'destinationName', 'userName','active', 'type', 'createdByName'];
    groupSelection = new SelectionModel<any>(true, []);
    destinationSelection = new SelectionModel<any>(true, []);
    destinationDataSource: MatTableDataSource<any>;
    groupDataSource: MatTableDataSource<any>;
    checkAll = false;
    showLoader: Boolean;
    selectedGrps: any;
    selectedDests: any;
    tabName: string;

    constructor(
        public dialogRef: MatDialogRef<GroupDestDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private groupService: GroupService,
        private destinationService: DestinationService,
        private commonService: CommonService) {
    }

    @ViewChild('MatPaginator1', { static: true }) matPaginator1: MatPaginator;
    @ViewChild('MatPaginator2', { static: true }) matPaginator2: MatPaginator;
    @ViewChild('matSort1', { static: true }) matSort1: MatSort;
    @ViewChild('matSort2', { static: true }) matSort2: MatSort;
    @ViewChild(MatTable, { static: true }) table: MatTable<any>;

    ngOnInit() {

        this.loadGroups();
        this.loadDestination();
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
                this.groupDataSource.paginator = this.matPaginator1;
                this.groupDataSource.sort = this.matSort1;
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

    loadDestination() {
        let addedDestStr = localStorage.getItem("selectedDests");
        this.showLoader = true;
        this.destinationService.getAllDestination().subscribe(
            res => {
                this.showLoader = false;
                this.destinations = res;
                this.destinationDataSource = new MatTableDataSource(this.destinations);
                this.destinationDataSource.paginator = this.matPaginator2;
                this.destinationDataSource.sort = this.matSort2;
                this.destinationDataSource.filterPredicate = function (data, filter: string): boolean {
                    return data.destinationName.toLowerCase().includes(filter);
                };

                // Enable Already Selected Fields
                if (addedDestStr != 'undefined' && addedDestStr != 'null') {
                    this.selectedDests = JSON.parse(addedDestStr);
                    for (let i = 0; i < this.selectedDests.length; i++) {
                        this.destinationDataSource.data.forEach(row => {
                            if (row.destinationId == this.selectedDests[i].destinationId) {
                                this.destinationSelection.select(row)
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
    }
    applyFilterGroup(filterValue: string) {
        filterValue = filterValue.trim(); // Remove whitespace
        filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
        this.groupDataSource.filter = filterValue;
    }
    applyFilterDestination(filterValue: string) {
        filterValue = filterValue.trim(); // Remove whitespace
        filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
        this.destinationDataSource.filter = filterValue;
    }
    isAllGroupSelected() {
        const numSelected = this.groupSelection.selected.length;
        const numRows = this.groupDataSource.data.length;
        return numSelected == numRows;
    }

    isAllDestinationSelected() {
        const numSelected = this.destinationSelection.selected.length;
        const numRows = this.destinationDataSource.data.length;
        return numSelected == numRows;
    }
    /** Selects all rows if they are not all selected; otherwise clear selection. */
    masterToggleDestination() {
        this.isAllDestinationSelected() ?
            this.destinationSelection.clear() :
            this.destinationDataSource.data.forEach(row => this.destinationSelection.select(row));
    }

    masterToggleGroup(){
        this.isAllGroupSelected() ?
            this.groupSelection.clear() :
            this.groupDataSource.data.forEach(row => this.groupSelection.select(row));
    }
    tabClick(tabName) {
        this.tabName = tabName
    }
    select() {
        this.selectedGrps = this.groupSelection.selected;
        this.selectedDests = this.destinationSelection.selected;

        if (this.selectedGrps.length >= 1 || this.selectedDests.length >= 1) {
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
            this.destinationSelection.clear()
        }

        this.selectedGrps = this.groupSelection.selected;
        this.selectedDests = this.destinationSelection.selected;

    }
    applyFilter(filterValue: string) {
        filterValue = filterValue.trim(); // Remove whitespace
        filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
        
      
        if (this.tabName == 'GROUP') {
            this.groupDataSource.filter = filterValue;
        } else if (this.tabName == 'DESTINATION') {
            this.destinationDataSource.filter = filterValue;
        }
      }
    
}
