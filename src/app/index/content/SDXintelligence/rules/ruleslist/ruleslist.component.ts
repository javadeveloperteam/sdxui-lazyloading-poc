import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource, MatTable, MatDialog } from '@angular/material';
import { Router } from "@angular/router";
import { CommonService } from 'src/app/common/services/common.service';
import { RuleService } from "../services/rule.service";
import { AlertPopupComponent } from '../../../users/modal/alert-popup/alert-popup.component';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-ruleslist',
  templateUrl: './ruleslist.component.html',
  styleUrls: ['./ruleslist.component.css']
})
export class RuleslistComponent implements OnInit {

  showLoader: Boolean = false;
  rules: any;
  displayedColumns = [ 'ruleName', 'applicationName', 'eventName', 'messageContent', 'Action'];
  dataSource: MatTableDataSource<any>;
 
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatTable, { static: true }) table: MatTable<any>;

  constructor(
    private router: Router,
    private ruleService: RuleService,
    private commonService: CommonService, 
    public dialog: MatDialog) {
  }

  ngOnInit() {
    this.showLoader = true;
    this.ruleService.getAllRules().subscribe(
      res => {
        this.showLoader = false;
        console.log(res);
        //this.commonService.openSnackBar("Department Loaded Successfully", 'badge-success');

        this.rules = res;
        this.dataSource = new MatTableDataSource(this.rules);
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
          return data.ruleName.toLowerCase().includes(filter);
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


  deleteRulePopUp(eventId, ruleId, ruleName) {
    this.showLoader = true;
    this.ruleService.getRuleDependents(ruleId, eventId).subscribe(
      res => {
        this.showLoader = false;
        let dataJson: {} = res;
        console.log(Object.keys(dataJson).length);
        if (Object.keys(dataJson).length > 0) {
          console.log(dataJson);
          let content = 'This Rule is Associated with below Entity(s)';
          for (let key in dataJson) {
            content += '<br><br><b>' + key + ':</b>';
            for (let i = 0; i < dataJson[key].length; i++) {
              content += '<br> &nbsp &nbsp ' + (i + 1) + ')' + dataJson[key][i];
            }
          }
          content += '<br><br>Kindly Delete the Associated Entities and Try Again';
          const dialogRef = this.dialog.open(AlertPopupComponent, {
            disableClose: true, data: {
              type: "alert",
              content: content,
              component:'rule'
            }
          });
        }
        else {
          const dialogRef = this.dialog.open(AlertPopupComponent, {
            disableClose: true, data: {
              type: "submit",
              content: 'Rule <b>"' + ruleName + '"</b> will be Removed Permanently. Do you want to Proceed ?',
              component:'rule'
            }
          });
          dialogRef.afterClosed().subscribe(result => {
            if ( dialogRef.componentInstance.isDelete == true ) {
                this.deleteRule(ruleId, ruleName);
              }
            
          
          });
        }

      },
      err => {
        this.showLoader = false;
      }
    );
  }
  statusUpdate(rule :any)
  {
    // update contact
    rule.active = !rule.active;
    this.updateRule(rule);
  }
  updateRule(rule) {
    this.showLoader = true;
    this.ruleService.updateRule(rule).subscribe(
      res => {
        console.log(res);
        this.showLoader = false;
        this.commonService.openSnackBar("Rule Updated Successfully", 'badge-success');
         this.router.navigate(['index/sdxintelligence/rules']);
        // this.clear()
      },
      err => {
        this.showLoader = false;
        console.log("Error occured");
        console.log(err);
        this.commonService.openSnackBar('Rule Update Failed : ' + err.error.message, 'badge-danger');
      }
    );
  }
  
  deleteRule(ruleId: any, ruleName: any) {
    this.showLoader = true;
    console.log(ruleId);
    this.ruleService.deleteRule(ruleId).subscribe(
      res => {
        this.showLoader = false;
        this.commonService.openSnackBar('Rule - ' + ruleName + ' Deleted Successfully', 'badge-success');
        this.ngOnInit();
      },
      err => {
        this.showLoader = false;
        this.commonService.openSnackBar('Rule Deletion Failed', 'badge-danger');
      }
    );
  }

  editRule(ruleId: any) {
    this.showLoader = true;
    this.router.navigate(['index/sdxintelligence/rules/edit']);
    localStorage.setItem("ruleId", JSON.stringify(ruleId));
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }
}
