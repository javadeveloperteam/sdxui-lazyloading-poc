import { Component, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { Injectable } from "@angular/core";
import { DestinationService } from "../../destination/services/destination.service";
import { MatPaginator, MatSort, MatTableDataSource, MatTable } from '@angular/material';
import { CommonService } from 'src/app/common/services/common.service';
import { SelectionModel } from '@angular/cdk/collections';
import { MatDialogRef } from '@angular/material/dialog';

@Injectable()
@Component({
    selector: 'app-destination-dialog',
    templateUrl: './destination-dialog.component.html',
    styleUrls: ['./destination-dialog.component.css'],
    encapsulation: ViewEncapsulation.None
})
export class DestinationDialogComponent implements OnInit {

    destinations: any;
    displayedColumns = ['select', 'destinationId', 'destinationName', 'active', 'type', 'createdByName'];
    selection = new SelectionModel<any>(true, []);
    dataSource: MatTableDataSource<any>;
    checkAll = false;
    showLoader: Boolean;
    selectedDests: any;

    constructor(
        public dialogRef: MatDialogRef<DestinationDialogComponent>,
        private destinationService: DestinationService,
        private commonService: CommonService) {
    }

    @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
    @ViewChild(MatSort, { static: true }) sort: MatSort;
    @ViewChild(MatTable, { static: true }) table: MatTable<any>;

    ngOnInit() {
        let addedDestsStr = localStorage.getItem("selectedDests");
        let destType = localStorage.getItem("destType");
        this.showLoader = true;
        this.destinationService.getAllDestination().subscribe(
            res => {
                this.showLoader = false;
                this.destinations = res;
                this.dataSource = new MatTableDataSource(this.destinations);
                this.dataSource.paginator = this.paginator;
                this.dataSource.sort = this.sort;
                this.dataSource.filterPredicate = function (data, filter: string): boolean {
                    return data.destinationName.toLowerCase().includes(filter);
                };

                // Enable Already Selected Fields
                console.log(addedDestsStr);
                if (addedDestsStr != 'undefined' && addedDestsStr != 'null') {
                    this.selectedDests = JSON.parse(addedDestsStr);
                    for (let i = 0; i < this.selectedDests.length; i++) {
                        this.dataSource.data.forEach(row => {
                            if (row.destinationId == this.selectedDests[i].destinationId) {
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

    select() {
        this.selectedDests = this.selection.selected;
        console.log(this.selection.selected);
        if( this.selection.selected.length>=1){
             this.close();
        }else{
            this.commonService.openSnackBar('Please select atleast one Contact', 'badge-danger');
         }
       
    }

    close() {
        this.dialogRef.close();
    }
    clear(){
        this.selection.clear()
    }
}
