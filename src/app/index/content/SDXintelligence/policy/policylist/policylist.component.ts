import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource, MatTable, MatDialog } from '@angular/material';
import { Router } from "@angular/router";
import { CommonService } from 'src/app/common/services/common.service';
import { PolicyService } from "../services/policy.service";
import { AlertPopupComponent } from '../../../users/modal/alert-popup/alert-popup.component';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-policylist',
  templateUrl: './policylist.component.html',
  styleUrls: ['./policylist.component.css']
})
export class PolicylistComponent implements OnInit {

  
  showLoader: Boolean = false;
  policies: any;
  displayedColumns = ['policyName', 'applicationName', 'eventName','rules', 'active','Action'];
  dataSource: MatTableDataSource<any>;
  broadSub: Subscription;

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatTable, { static: true }) table: MatTable<any>;

  constructor(
    private router: Router,
    private policyService: PolicyService,
    private commonService: CommonService,
    public dialog: MatDialog) {
  }

  ngOnInit() {
    this.showLoader = true;
    this.policyService.getAllPolicies().subscribe(
      res => {
        this.showLoader = false;
        console.log(res);
        //this.commonService.openSnackBar("Department Loaded Successfully", 'badge-success');

        this.policies = res;
        this.dataSource = new MatTableDataSource(this.policies);
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
          return data.policyName.toLowerCase().includes(filter);
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
        this.commonService.openSnackBar('Policy Load Failed', 'badge-danger');
        console.log("Error occured");
      }
    );
  }

  deletePolicy(policyId: any, policyName: any) {
    const dialogRef = this.dialog.open(AlertPopupComponent, {
      disableClose: true, data: {
          type: "submit",
          content: 'Policy <b>"' + policyName + '"</b> will be Removed Permanently. Do you want to Proceed ?',
          component:'policy'
      }
  });
  dialogRef.afterClosed().subscribe(result => {
    if ( dialogRef.componentInstance.isDelete == true ) {

    this.showLoader = true;
    console.log(policyId);
    this.policyService.deletePolicy(policyId).subscribe(
      res => {
        this.showLoader = false;
        this.commonService.openSnackBar('Policy - ' + policyName + ' Deleted Successfully', 'badge-success');
        this.ngOnInit();
      },
      err => {
        this.showLoader = false;
        this.commonService.openSnackBar('Policy Deletion Failed', 'badge-danger');
      }
    );
          }
          
       
      });
  }


  editPolicy(policyId: any) {
    this.showLoader = true;
    this.router.navigate(['index/sdxintelligence/policies/edit']);
    localStorage.setItem("policyId", JSON.stringify(policyId));
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }
}
