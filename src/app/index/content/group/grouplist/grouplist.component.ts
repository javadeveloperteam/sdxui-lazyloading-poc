import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource, MatTable, MatDialog } from '@angular/material';
import { Router } from "@angular/router";
import { CommonService } from 'src/app/common/services/common.service';
import { GroupService } from "../services/group.service";
import { AlertPopupComponent } from '../../users/modal/alert-popup/alert-popup.component';
import { Subscription } from 'rxjs';
import { Helpers } from "src/app/helpers/helpers";

@Component({
  selector: 'app-grouplist',
  templateUrl: './grouplist.component.html',
  styleUrls: ['./grouplist.component.css']
})
export class GrouplistComponent implements OnInit {

  showLoader: Boolean = false;
  departments: any;
  displayedColumns = ['groupName','escalation','active'];
  dataSource: MatTableDataSource<any>;

  userRole:any;

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatTable, { static: true }) table: MatTable<any>;

  constructor(
    private router: Router,
    private groupService: GroupService,
    private commonService: CommonService,
    public dialog: MatDialog) {
      this.userRole = Helpers.getUserRole();
      if(this.userRole != 'User')
      {
          this.displayedColumns.push('action');
      }
  }

  ngOnInit() {

    this.showLoader = true;
    this.groupService.getAllGroups().subscribe(
      res => {
        this.showLoader = false;
        console.log(res);
      //  this.commonService.openSnackBar("Group Loaded Successfully", 'badge-success');
        this.departments = res;
        this.dataSource = new MatTableDataSource(this.departments);
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
          return data.groupName.toLowerCase().includes(filter);
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
        this.commonService.openSnackBar('Group Load Failed', 'badge-danger');
        console.log("Error occured");
      }
    );
  }

  deleteGroup(groupId: any, groupName: any) {
    const dialogRef = this.dialog.open(AlertPopupComponent, {
      disableClose: true, data: {
          type: "submit",
          component:"group",
          content: 'Group <b>"' + groupName + '"</b> will be Removed Permanently. Do you want to Proceed ?'
      }
  });
  dialogRef.afterClosed().subscribe(result => {
    if ( dialogRef.componentInstance.isDelete == true ) {
    this.showLoader = true;
    console.log(groupId);
    this.groupService.deleteGroup(groupId).subscribe(
      res => {
        this.showLoader = false;
        this.commonService.openSnackBar('Group - ' + groupName + ' Deleted Successfully', 'badge-success');
        this.ngOnInit();
      },
      err => {
        this.showLoader = true;
        this.commonService.openSnackBar('Group Deletion Failed', 'badge-danger');
      }
    );
          }
        
        
      });
  }
  statusUpdate(group :any)
  {
    // update contact
    group.active = !group.active;
    this.updateGroup(group);
  }
  updateGroup(group) {
    this.showLoader = true;
    this.groupService.updateGroup(group).subscribe(
      res => {
        console.log(res);
        this.showLoader = false;
        this.commonService.openSnackBar("Group Updated Successfully", 'badge-success');
      },
      err => {
        console.error(err);
        console.log("Error occured");
        this.showLoader = false;
        this.commonService.openSnackBar("Group update Failed: " + err.error.message, 'badge-danger');
      }
    );
  }

  editGroup(groupId: any) {
    this.showLoader = true;
    this.router.navigate(['index/groups/edit']);
    localStorage.setItem("groupId", JSON.stringify(groupId));
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }

}
