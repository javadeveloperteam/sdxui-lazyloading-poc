import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource, MatTable, MatDialog } from '@angular/material';
import { Router } from "@angular/router";
import { CommonService } from 'src/app/common/services/common.service';
import { ConfigurationService } from "../services/configuration.service";
import { AlertPopupComponent } from '../../users/modal/alert-popup/alert-popup.component';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-configurationlist',
  templateUrl: './configurationlist.component.html',
  styleUrls: ['./configurationlist.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class ConfigurationlistComponent implements OnInit {

  showLoader: Boolean = false;
  configurations: any;
  displayedColumns = [ 'configurationName', 'type','active', 'action'];
  dataSource: MatTableDataSource<any>;
 

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatTable, { static: true }) table: MatTable<any>;

  constructor(
    private router: Router,
    private configurationService: ConfigurationService,
    private commonService: CommonService, public dialog: MatDialog) {

  }

  ngOnInit() {
    this.showLoader = true;
    this.configurationService.getAllConfigurations().subscribe(
      res => {
        this.showLoader = false;
        console.log(res);
        // this.commonService.openSnackBar("Configuration Loaded Successfully", 'badge-success');

        this.configurations = res;
        this.dataSource = new MatTableDataSource(this.configurations);
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
          return data.configurationName.toLowerCase().includes(filter);
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
        this.commonService.openSnackBar('Configuration Load Failed', 'badge-danger');
        console.log("Error occured");
      }
    );
  }

  deleteConfiguration(configurationId: any, configurationName: any) {
    const dialogRef = this.dialog.open(AlertPopupComponent, {
      disableClose: true, data: {
        type: "submit",
        component:"configuration",
        content: 'Configuration <b>"' + configurationName + '"</b> will be Removed Permanently. Do you want to Proceed ?'
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if ( dialogRef.componentInstance.isDelete == true ) {
      this.showLoader = true;
      console.log(configurationId);
      this.configurationService.deleteConfiguration(configurationId).subscribe(
        res => {
          this.showLoader = false;
          this.commonService.openSnackBar('Configuration - ' + configurationName + ' Deleted Successfully', 'badge-success');
          this.ngOnInit();
        },
        err => {
          this.showLoader = false;
          this.commonService.openSnackBar('Configuration Deletion Failed', 'badge-danger');
        }
      );
      this.ngOnInit()
     }
    
  
    })
}
statusUpdate(configuration :any)
{
  // update contact
  configuration.active = !configuration.active;
  this.updateConfiguration(configuration);
}
updateConfiguration(configuration) {
this.showLoader = true;
this.configurationService.updateConfiguration(configuration).subscribe(
    res => {
      console.log(res);
      this.showLoader = false;
     
      this.commonService.openSnackBar("Configuration Updated Successfully", 'badge-success');
      this.router.navigate(['index/configurations']);
    },
    err => {
      this.showLoader = false;
      console.log("Error occured");
      console.log(err);
      this.commonService.openSnackBar('Configuration Update Failed: '+err.error.message, 'badge-danger');
    }
  );
}

  editConfiguration(configurationId: any) {
    this.showLoader = true;
    this.router.navigate(['index/configurations/edit']);
    localStorage.setItem("configurationId", JSON.stringify(configurationId));
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }
}
