import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource, MatTable, MatDialog } from '@angular/material';
import { Router } from "@angular/router";
import { CommonService } from 'src/app/common/services/common.service';
import { ApplicationService } from "../services/application.service";
import { AlertPopupComponent } from '../../../users/modal/alert-popup/alert-popup.component';
import { AppEventPopupComponent } from '../../../dialog/app-event-popup/app-event-popup.component';

@Component({
  selector: 'app-applicationlist',
  templateUrl: './applicationlist.component.html',
  styleUrls: ['./applicationlist.component.css']
})
export class ApplicationlistComponent implements OnInit {

  showLoader: Boolean = false;
  rules: any;
  displayedColumns = [ 'applicationName', 'events', 'Action'];
  dataSource: MatTableDataSource<any>;


  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatTable, { static: true }) table: MatTable<any>;

  constructor(
    private router: Router,
    private applicationService: ApplicationService,
    public dialog: MatDialog,
    private commonService: CommonService) {
  }

  ngOnInit() {
    this.showLoader = true;
    this.applicationService.getAllApplication().subscribe(
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
          return data.applicationName.toLowerCase().includes(filter);
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
        this.commonService.openSnackBar('Application Load Failed', 'badge-danger');
        console.log("Error occured");
      }
    );
  }

  deleteApplication(applicationId: any, applicationName: any) {
    this.showLoader = true;
    console.log(applicationId);
    this.applicationService.deleteApplication(applicationId).subscribe(
      res => {
        this.showLoader = false;
        this.commonService.openSnackBar('Application - ' + applicationName + ' Deleted Successfully', 'badge-success');
        this.ngOnInit();
      },
      err => {
        this.showLoader = false;
        this.commonService.openSnackBar('Application Deletion Failed', 'badge-danger');
      }
    );
  }

  deleteAppPopUp(applicationId, applicationName) {
    this.showLoader = true;
    this.applicationService.getApplicationDependents(applicationId).subscribe(
      res => {
        this.showLoader = false;
        let dataJson: {} = res;
        console.log(Object.keys(dataJson).length);
        if (Object.keys(dataJson).length > 0) {
          console.log(dataJson);
          let content = 'This Application is Associated with below Entity(s)';
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
              component:'application'
              
            }
          });
        }
        else {
          const dialogRef = this.dialog.open(AlertPopupComponent, {
            disableClose: true, data: {
              type: "submit",
              content: 'Application <b>"' + applicationName + '"</b> will be Removed Permanently. Do you want to Proceed ?',
             component:'application'
            }
          });
          dialogRef.afterClosed().subscribe(result => {
            if ( dialogRef.componentInstance.isDelete == true ) {
              this.deleteApplication(applicationId, applicationName);
            }
          

          });
        }

      },
      err => {
        this.showLoader = false;
      }
    );
  }
  statusUpdate(application :any)
  {
    // update contact
    application.active = !application.active;
    this.updateApplication(application);
  }
  updateApplication(application) {
    this.showLoader = true;
    this.applicationService.updateApplication(application).subscribe(
      res => {
        console.log(res);
        this.showLoader = false;
        this.commonService.openSnackBar("Application Updated Successfully", 'badge-success');
        // this.router.navigate(['index/rules']);
      },
      err => {
        this.showLoader = false;
        console.log("Error occured");
        console.log(err);
        this.commonService.openSnackBar('Application Update Failed : ' + err.error.message, 'badge-danger');
      }
    );
  }
  editApplication(applicationId: any) {
    this.showLoader = true;
    this.router.navigate(['index/sdxintelligence/applications/editApplication']);
    localStorage.setItem("applicationId", JSON.stringify(applicationId));
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }

  showEventInfo(applicationId) {
    const dialogRef = this.dialog.open(AppEventPopupComponent, { disableClose: true , 
      data : {applicationId:applicationId}});

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
   });
  }
}
