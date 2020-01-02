import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource, MatTable, MatDialog } from '@angular/material';
import { CommonService } from 'src/app/common/services/common.service';
import { Router } from '@angular/router';
import { AssetService } from '../service/asset.service';
import { AlertPopupComponent } from '../../../users/modal/alert-popup/alert-popup.component';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-assetlist',
  templateUrl: './assetlist.component.html',
  styleUrls: ['./assetlist.component.css']
})
export class AssetlistComponent implements OnInit {


  dataSource: MatTableDataSource<any>;
  showLoader: Boolean = false;
  assets: any = [];
  displayedColumns: any = []
  locAssetData: any

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  @ViewChild(MatTable, { static: true }) table: MatTable<any>;
  assetId: any;

  constructor(private assetService: AssetService, private router: Router, private commonService: CommonService,
    public dialog: MatDialog) { }


  ngOnInit() {
    this.getAssetList();
  }

  getAssetList() {
    this.showLoader = true;
    this.displayedColumns = [ 'assetName', 'assetIdentifier', 'locationName',
      'category', 'action'];

    this.assetService.getAllAsset().subscribe(
      res => {
        this.showLoader = false;
        this.assets = res;

        this.dataSource = new MatTableDataSource(this.assets);

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
          return data.assetName.toLowerCase().includes(filter);
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
        this.commonService.openSnackBar('Asset Load Failed', 'badge-danger');
        console.log("Error occured");
      }
    );
  }
  
  addasset() {
    this.router.navigate(['index/sdxintelligence/assets/add']);

  }
  editAsset(editData) {
    localStorage.setItem('assetEdit', JSON.stringify(editData))
    this.router.navigate(['index/sdxintelligence/assets/edit']);
  }

  deleteAssetPopUp(assetId, assetName) {
    this.showLoader = true;
    this.assetService.getAssetDependents(assetId).subscribe(
      res => {
        this.showLoader = false;
        let dataJson: {} = res;
        console.log(Object.keys(dataJson).length);
        if (Object.keys(dataJson).length > 0) {
          console.log(dataJson);
          let content = 'This Asset is Associated with below Entity(s)';
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
              component:'asset'
            }
          });
        }
        else {
          const dialogRef = this.dialog.open(AlertPopupComponent, {
            disableClose: true, data: {
              type: "submit",
              content: 'Asset <b>"' + assetName + '"</b> will be Removed Permanently. Do you want to Proceed ?',
              component:'asset'
            }
          });
          dialogRef.afterClosed().subscribe(result => {
            if ( dialogRef.componentInstance.isDelete == true ) {
                this.deleteAsset(assetId, assetName);
              }
            
         
          });
        }

      },
      err => {
        this.showLoader = false;
      }
    );
  }
  deleteAsset(assetId, assetName) {
    this.showLoader = true;
    this.assetService.deleteAsset(assetId).subscribe(
      res => {
        this.showLoader = false;
        this.commonService.openSnackBar('Asset - ' + assetName + ' Deleted Successfully', 'badge-success');
        this.getAssetList();

      },
      err => {
        this.showLoader = false;
        console.error(err);
        this.commonService.openSnackBar('Asset Deletion FAILED : ' + err.error.message, 'badge-danger');
      }
    );
  }
  statusUpdate(asset :any)
  {
    // update contact
    asset.active = !asset.active;
    this.updateAsset(asset);
  }
  updateAsset(contact)
 {
    this.assetService.updateAsset(contact.assetId , contact).subscribe(
      res => {
        this.showLoader = false;
        this.commonService.openSnackBar('Asset - ' + contact.assetName + ' Updated Successfully', 'badge-success');
        this.router.navigate(['index/sdxintelligence/assets'])

      },
      err => {
        this.showLoader = false;
        console.error(err);
        this.commonService.openSnackBar('ASSET UPDATE FAILED : ' + err.error.message, 'badge-danger');
      }
    );
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }
}
