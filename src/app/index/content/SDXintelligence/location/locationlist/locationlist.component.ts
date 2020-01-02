import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource, MatTable, MatDialog } from '@angular/material';
import { CommonService } from 'src/app/common/services/common.service';
import { Router } from '@angular/router';
import { LocationsService } from '../services/locations.service';
import { AlertPopupComponent } from '../../../users/modal/alert-popup/alert-popup.component';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-locationlist',
  templateUrl: './locationlist.component.html',
  styleUrls: ['./locationlist.component.css']
})

export class LocationlistComponent implements OnInit {

  dataSource: MatTableDataSource<any>;
  showLoader: Boolean = false;
  locations: any = [];
  displayedColumns: any = []
  locData: any
  activelocation: boolean = false
  activeAssetPopup: boolean = false

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatTable, { static: true }) table: MatTable<any>;
  LocationId: number;

  constructor(private locationService: LocationsService,
    public dialog: MatDialog, private router: Router, private commonService: CommonService) { }

  ngOnInit() {


    this.getLocationList();
  }



  getLocationList() {
    this.showLoader = true;

    this.displayedColumns = ['locationName', 'addressLine1', 'addressLine2', 'countryName',
      'stateName', 'city', 'zipcode','Action'];

    this.locationService.getAllLocation().subscribe(
      res => {
        this.showLoader = false;
        console.log(res);
        this.locations = res;
        this.dataSource = new MatTableDataSource(this.locations);

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
          return data.locationName.toLowerCase().includes(filter);
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
        this.commonService.openSnackBar('Location Load Failed', 'badge-danger');
        console.log("Error occured");
      }
    );
  }
  addlocation() {
    this.router.navigate(['index/sdxintelligence/locations/add']);
  }
  editlocation(editData) {
    localStorage.setItem('locationEdit', JSON.stringify(editData))
    this.router.navigate(['index/sdxintelligence/locations/edit']);
  }

  deleteLocationPopUp(locationId, locationName) {
    this.showLoader = true;
    this.locationService.getLocationDependents(locationId).subscribe(
      res => {
        this.showLoader = false;
        let dataJson: {} = res;
        console.log(Object.keys(dataJson).length);
        if (Object.keys(dataJson).length > 0) {
          console.log(dataJson);
          let content = 'This Location is Associated with below Entity(s)';
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
              component:'location'
            }
          });
        }
        else {
          const dialogRef = this.dialog.open(AlertPopupComponent, {
            disableClose: true, data: {
              type: "submit",
              content: 'Location <b>"' + locationName + '"</b> will be Removed Permanently. Do you want to Proceed ?',
              component:'location'
            }
          });
          dialogRef.afterClosed().subscribe(result => {
            if ( dialogRef.componentInstance.isDelete == true ) {
                this.deleteLocation(locationId, locationName);
              }
            
           
          });
        }

      },
      err => {
        this.showLoader = false;
      }
    );
  }
  statusUpdate(location :any)
  {
    // update contact
    location.active = !location.active;
    this.updatelocation(location);
  }
  updatelocation(location) {
   
    this.locationService.updateLocation(location.locationId, JSON.stringify(location)).subscribe(
      res => {
        this.showLoader = false;
        this.commonService.openSnackBar('Location - ' + location.locationName + ' Updated Successfully', 'badge-success');
        this.router.navigate(['index/sdxintelligence/locations'])

      },
      err => {
        this.showLoader = false;
        console.error(err);
        this.commonService.openSnackBar('LOCATION UPDATE FAILED : ' + err.error.message, 'badge-danger');
      }
    );
  }
  deleteLocation(locationId, locationName) {
    this.showLoader = true;
    this.locationService.deleteLocation(locationId).subscribe(
      res => {
        this.commonService.openSnackBar('Location - ' + locationName + ' Deleted Successfully', 'badge-success');
        this.showLoader = false;
        this.getLocationList();
      
      },
      err => {
        this.showLoader = false;
        console.error(err);
        this.commonService.openSnackBar('LOCATION DELETE FAILED : ' + err.error.message, 'badge-danger');
      }
    );
  }
  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }
}
