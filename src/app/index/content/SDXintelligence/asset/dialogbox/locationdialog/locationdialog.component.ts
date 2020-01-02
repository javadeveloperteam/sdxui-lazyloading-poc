import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource, MatTable } from '@angular/material';
import { CommonService } from 'src/app/common/services/common.service';
import { Router } from '@angular/router';
import { SelectionModel } from '@angular/cdk/collections';
import { VERSION, MatDialogRef, MatDialog, MatSnackBar, MAT_DIALOG_DATA } from '@angular/material';
import { LocationsService } from '../../../location/services/locations.service';

@Component({
  selector: 'app-locationdialog',
  templateUrl: './locationdialog.component.html',
  styleUrls: ['./locationdialog.component.css'],
  encapsulation: ViewEncapsulation.None

})
export class LocationdialogComponent implements OnInit {
  closeDialog: boolean = true
  selection = new SelectionModel<any>(false);

  activeAssetPopup: boolean = false
  matchecked: boolean = false;
  dataSource: MatTableDataSource<any>;
  showLoader: Boolean = false;
  locations: any = [];
  displayedColumns: any = []
  locData: any
  locationdialogData: any;

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatTable, { static: true }) table: MatTable<any>;
  locationData: any = []
  arrayLocationData: any = [];


  constructor(private dialogRef: MatDialogRef<any>, private locationService: LocationsService, private router: Router,
    private commonService: CommonService) { }


  ngOnInit() {
    this.activeAssetPopup = true;
    this.displayedColumns = ['select', 'locationName', 'addressLine1', 'countryName',
      'stateName', 'city', 'comments'];
    this.locationService.getAllLocation().subscribe(
      res => {
        this.showLoader = false;
        console.log(res);
        this.locations = res;
        this.dataSource = new MatTableDataSource(this.locations);

        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.dataSource.filterPredicate = function (data, filter: string): boolean {
          return data.locationName.toLowerCase().includes(filter);
        };

        this.locationData = JSON.parse(localStorage.getItem('locationData'))
        this.arrayLocationData.push(this.locationData)
        if (this.locationData !== 'undefined' && this.locationData !== 'null' && this.locationData !== "") {
          for (let i = 0; i < this.arrayLocationData.length; i++) {
            this.dataSource.data.forEach(row => {
              // for(let j = 0; j < this.dataSource.data.length; j++){
              if (row.locationId == this.arrayLocationData[i].locationId) {
                this.selection.select(row)
                this.locationdialogData = row;
                this.locationService.setLocationData(this.locationdialogData);
              }
            })
          }
        }
      }
      ,
      err => {
        this.showLoader = false;
        this.commonService.openSnackBar('Location Load Failed', 'badge-danger');
        console.log("Error occured");
      }
    );


  }
  checkSelection(value, rowItem) {
    this.matchecked = !value;
    if (this.matchecked == true) {
      this.locationdialogData = rowItem
    }


  }
  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.dataSource.data.forEach(row =>
         this.selection.select(row));
  }
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected == numRows;
  }

  
  select() {
    if (this.selection.selected.length == 1) {
      this.locationService.setLocationData(this.locationdialogData);
      localStorage.setItem('locationData', JSON.stringify(this.locationdialogData));
      this.dialogRef.close(LocationdialogComponent);
    } else {
      this.commonService.openSnackBar('Please select one location', 'badge-danger');
    }
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }
  clear(){
    this.selection.clear();
    this.locationService.setLocationData({});
  }

}
