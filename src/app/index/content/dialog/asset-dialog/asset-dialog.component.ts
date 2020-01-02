import { Component, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { Injectable } from "@angular/core";
import { AssetService } from "../../SDXintelligence/asset/services/asset.service";
import { MatPaginator, MatSort, MatTableDataSource, MatTable } from '@angular/material';
import { CommonService } from 'src/app/common/services/common.service';
import { SelectionModel } from '@angular/cdk/collections';
import { MatDialogRef } from '@angular/material/dialog';

@Injectable()
@Component({
    selector: 'app-asset-dialog',
    templateUrl: './asset-dialog.component.html',
    styleUrls: ['./asset-dialog.component.css'],
    encapsulation: ViewEncapsulation.None
})
export class AssetDialogComponent implements OnInit {

    assets: any;
    displayedColumns = ['select',  'assetName', 'assetIdentifier', 'locationName', 'createdBy'];
    selection = new SelectionModel<any>(true, []);
    dataSource: MatTableDataSource<any>;
    checkAll = false;
    showLoader: Boolean;
    selectedAssets = [];

    constructor(
        public dialogRef: MatDialogRef<AssetDialogComponent>,
        private assetService: AssetService,
        private commonService: CommonService) {
    }

    @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
    @ViewChild(MatSort, { static: true }) sort: MatSort;
    @ViewChild(MatTable, { static: true }) table: MatTable<any>;

    ngOnInit() {
        let addedAssetsStr = localStorage.getItem("selectedAssets");
        this.showLoader = true;
        this.assetService.getAllAssets().subscribe(
            res => {
                this.showLoader = false;
                this.assets = res;
                this.dataSource = new MatTableDataSource(this.assets);
                this.dataSource.paginator = this.paginator;
                this.dataSource.sort = this.sort;
                this.dataSource.filterPredicate = function (data, filter: string): boolean {
                    return data.assetName.toLowerCase().includes(filter);
                };

                // Enable Already Selected Fields
                console.log(addedAssetsStr);
                if (addedAssetsStr != 'undefined' && addedAssetsStr != 'null') {
                    this.selectedAssets = JSON.parse(addedAssetsStr);
                    for (let i = 0; i < this.selectedAssets.length; i++) {
                        this.dataSource.data.forEach(row => {
                            if (row.assetId == this.selectedAssets[i].assetId) {
                                this.selection.select(row)
                            }
                        });
                    }
                }
            },
            err => {
                this.showLoader = false;
                this.commonService.openSnackBar('Asset Load Failed', 'badge-danger');
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
        this.selectedAssets = this.selection.selected;
        console.log(this.selection.selected);
        if( this.selection.selected.length>=1){
            this.close();
       }else{
           this.commonService.openSnackBar('Please select atleast one asset', 'badge-danger');
        }
    }

    close()
    {
        this.dialogRef.close();
    }

    clear(){
        this.selection.clear();
        this.selectedAssets = this.selection.selected;
    }

}
