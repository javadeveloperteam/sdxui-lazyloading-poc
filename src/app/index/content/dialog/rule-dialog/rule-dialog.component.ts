import { Component, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { Injectable } from "@angular/core";
import { RuleService } from "../../SDXintelligence/rules/services/rule.service";
import { MatPaginator, MatSort, MatTableDataSource, MatTable } from '@angular/material';
import { CommonService } from 'src/app/common/services/common.service';
import { SelectionModel } from '@angular/cdk/collections';
import { MatDialogRef } from '@angular/material/dialog';

@Injectable()
@Component({
    selector: 'app-rule-dialog',
    templateUrl: './rule-dialog.component.html',
    styleUrls: ['./rule-dialog.component.css'],
    encapsulation: ViewEncapsulation.None
})
export class RuleDialogComponent implements OnInit {

    rules: any;
    displayedColumns = ['select', 'ruleName', 'applicationName', 'eventName', 'createdBy'];
    selection = new SelectionModel<any>(true, []);
    dataSource: MatTableDataSource<any>;
    checkAll = false;
    showLoader: Boolean;
    selectedRules: any;

    constructor(
        public dialogRef: MatDialogRef<RuleDialogComponent>,
        private ruleService: RuleService,
        private commonService: CommonService) {
    }

    @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
    @ViewChild(MatSort, { static: true }) sort: MatSort;
    @ViewChild(MatTable, { static: true }) table: MatTable<any>;

    ngOnInit() {
        let addedRulesStr = localStorage.getItem("selectedRules");
        let eventId = localStorage.getItem("eventId");
        this.showLoader = true;
        this.ruleService.getRuleByEvent(eventId).subscribe(
            res => {
                this.showLoader = false;
                this.rules = res;
                this.dataSource = new MatTableDataSource(this.rules);
                this.dataSource.paginator = this.paginator;
                this.dataSource.sort = this.sort;
                this.dataSource.filterPredicate = function (data, filter: string): boolean {
                    return data.ruleName.toLowerCase().includes(filter);
                };

                // Enable Already Selected Fields
                console.log(addedRulesStr);
                if (addedRulesStr != 'undefined' && addedRulesStr != 'null') {
                    this.selectedRules = JSON.parse(addedRulesStr);
                    for (let i = 0; i < this.selectedRules.length; i++) {
                        this.dataSource.data.forEach(row => {
                            if (row.ruleId == this.selectedRules[i].ruleId) {
                                this.selection.select(row)
                            }
                        });
                    }
                }
            },
            err => {
                this.showLoader = false;
                this.commonService.openSnackBar('Rule Load Failed', 'badge-danger');
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
        this.selectedRules = this.selection.selected;
        console.log(this.selection.selected);
        if(this.selectedRules.length >= 1){
            this.close();
        }else{
       this.commonService.openSnackBar('Please select atleast one rule', 'badge-danger');
    }
    }

    close()
    {
        this.dialogRef.close();
    }
    clear(){
        this.selection.clear();
        this.selectedRules = this.selection.selected;
    }
}
