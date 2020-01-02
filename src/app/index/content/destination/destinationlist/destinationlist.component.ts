import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource, MatTable, MatDialog } from '@angular/material';
import { Router } from "@angular/router";
import { CommonService } from 'src/app/common/services/common.service';
import { DestinationService } from "../services/destination.service";
import { UsersService } from "../../users/services/users.service";
import { Helpers } from "src/app/helpers/helpers";
import { AlertPopupComponent } from '../../users/modal/alert-popup/alert-popup.component';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-destinationlist',
  templateUrl: './destinationlist.component.html',
  styleUrls: ['./destinationlist.component.css']
})
export class DestinationlistComponent implements OnInit {

  showLoader: Boolean = false;
  userRole : any;
  destinations: any;
  displayedColumns = [ 'destinationName','userName', 'type', 'emailId','toNumber','active'];
  dataSource: MatTableDataSource<any>;

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatTable, { static: true }) table: MatTable<any>;

  constructor(
    private router: Router,
    private destinationService: DestinationService,
    private commonService: CommonService,
    private userService:UsersService,
    public dialog: MatDialog) {
      this.userRole = Helpers.getUserRole();
      if(this.userRole != 'User')
      {
          this.displayedColumns.push('action');
      }
  
  }

  ngOnInit() {
  
    this.showLoader = true;
    this.destinationService.getAllDestination().subscribe(
      res => {
        this.showLoader = false;
        console.log(res);
        // this.commonService.openSnackBar("Destination Loaded Successfully", 'badge-success');
/* 
        if(this.userRole == 'User')
        {
          let userId = Helpers.getCurrentUser().userId;
          this.destinations = res;
          let temp = [];
          for(let i = 0 ; i < this.destinations.length ; i++)
          {
            if(this.destinations[i].userId == userId)
            {
              temp.push(this.destinations[i]);
            }
          }
          this.destinations = temp;
        }
        else{
          this.destinations = res;
        }
 */
        this.destinations = res;
        this.dataSource = new MatTableDataSource(this.destinations);
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
          return data.destinationName.toLowerCase().includes(filter);
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
        this.commonService.openSnackBar('Destination Load Failed', 'badge-danger');
        console.log("Error occured");
      }
    );
  }

  deleteDestination(destinationId: any, destinationName: any) {
    const dialogRef = this.dialog.open(AlertPopupComponent, {
      disableClose: true, data: {
        type: "submit",
        component: 'destination',
        content: 'Contact <b>"' + destinationName + '"</b> will be Removed Permanently. Do you want to Proceed ?'
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      // this.broadSub = this.commonService.commonPopUpData.subscribe(res => {
       
          if ( dialogRef.componentInstance.isDelete == true ) {
            this.showLoader = true;
            console.log(destinationId);
            this.destinationService.deleteDestination(destinationId).subscribe(
              res => {
               
                  this.showLoader = false;
                  this.commonService.openSnackBar('Contact - ' + destinationName + ' Deleted Successfully', 'badge-success');
                  this.ngOnInit();
               
                
              },
              err => {
                this.showLoader = false;
                this.commonService.openSnackBar('Contact Deletion Failed', 'badge-danger');
              }
            );
          }
        

      // });
    });
  }
  // ngOnDestroy() {
  //   if (this.broadSub != undefined) {
  //     this.broadSub.unsubscribe();
  //   }
  // }

  editDestination(destinationId: any, userId:any, active : boolean) {
    this.showLoader = true;
    if(active)
    {
    this.router.navigate(['index/destinations/edit']);
    localStorage.setItem("destinationId", JSON.stringify(destinationId));
    }
    else
    {
      this.getUser(userId,destinationId);
    }
  }

  
  getUser(userId: any,destinationId : any) {
    this.userService.getUser(userId).subscribe(
      res => {
        this.showLoader = false;
        console.log(res);         
         let user = res;
          if(!user['active'])
          {
            this.commonService.openSnackBar('Cannot Edit this Contact. Associated User is In-Active', 'badge-danger');
          }
          else
          {           
            localStorage.setItem("destinationId", JSON.stringify(destinationId));
            this.router.navigate(['index/destinations/edit']);
          }
      },
      err => {
        console.log("Error occured");
        this.showLoader = false;
        console.log(err);
        this.commonService.openSnackBar('Contact Load Failed : ' + err.error.message, 'badge-danger');
      }
    );
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }

  statusUpdate(contact :any)
  {
    // update contact
    contact.active = !contact.active;
    this.updateDestination(contact);
  }

  
  updateDestination(contact :any) {
    this.showLoader = true;
    this.destinationService.updateDestination(contact).subscribe(
      res => {
        console.log(res);
        this.showLoader = false;
        this.commonService.openSnackBar("Contact Updated Successfully", 'badge-success');
        this.ngOnInit();
      },
      err => {
        this.showLoader = false;
        console.log("Error occured");
        console.log(err);
        this.commonService.openSnackBar('Contact Update Failed : ' + err.error.message, 'badge-danger');
      }
    );
  }
}
