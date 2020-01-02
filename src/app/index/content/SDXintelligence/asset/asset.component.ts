import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { LocationsService } from '../location/services/locations.service';
import { LocationdialogComponent } from './dialogbox/locationdialog/locationdialog.component';
import { ContactDialogComponent } from './dialogbox/contact-dialog/contact-dialog.component';
import { DepartmentDialogComponent } from './dialogbox/department-dialog/department-dialog.component';
import { CommonService } from 'src/app/common/services/common.service';
import { AssetService } from './service/asset.service';
import { UsersService } from '../../users/services/users.service';
import { DepartmentService } from '../../department/services/department.service';
@Component({
  selector: 'app-asset',
  templateUrl: './asset.component.html',
  styleUrls: ['./asset.component.css']
})
export class AssetComponent implements OnInit {
  dialogLocationName: string
  assetForm: FormGroup;
  submitted: boolean;
  currentPage: string;
  localLocation: any = []
  selctedContact: any
  selctedLocation: any;
  selctedDepartment: any;
  showLoader: Boolean = false;
  editData: any;
  assetId: number;
  getEditValues: any;
  assetHeader: string;
  countryList: any;
  stateList: any;
  cityList: any;

  constructor(private locationService: LocationsService, private assetService: AssetService,
    private userService: UsersService,
    private commonService: CommonService, public dialog: MatDialog, private formBuilder: FormBuilder,
    private router: Router, private route: ActivatedRoute, private departmentService: DepartmentService, ) {
    this.route.params.subscribe(params => this.currentPage = params['page']);
  }

  ngOnInit() {
    this.assetForm = this.formBuilder.group({
      assetId: [],
      assetName: ['', Validators.required],
      assetIdentifier: ['', Validators.required],
      locationId: [],
      locationName: ['', Validators.required],
      userId: [],
      userName: ['', Validators.required],
      category: ['', Validators.required],
      subCategory: ['', Validators.required],
      lifeCycleStatus: [''],
      managementStatus: [''],
      departmentId: [],
      departmentName: [''],
      active: ['true'],
      status:[''],
      comments: [''],
      createdBy: [],
      createdByName: [],
      createdOn: []

    })
    this.showLoader = true;

    this.locationService.setLocationData('');
    this.departmentService.setDepartmentData('');
    this.userService.setContactData('');



    switch (this.currentPage) {
      case 'add':
        this.assetHeader = "Create Asset"
        this.showLoader = false;
        localStorage.setItem('locationData',"{}");
        localStorage.setItem('contactData',"{}");
        localStorage.setItem('departmentData',"{}");
        break;
      case 'edit':
        this.editData = JSON.parse(localStorage.getItem('assetEdit'))
        this.assetId = this.editData.assetId
        this.assetHeader = "Update Asset"
        this.getEditData();

        break;
      default:
        break;
    }
  }
  getEditData() {
    this.assetService.EditAsset(this.assetId).subscribe(
      res => {
        this.getEditValues = res
        this.showLoader = false;
        this.assetForm.patchValue(this.getEditValues);
        localStorage.setItem('locationData',JSON.stringify(new Location(this.f.locationId.value,this.f.locationName.value)));
        localStorage.setItem('contactData',JSON.stringify(new User(this.f.userId.value,this.f.userName.value)));
        localStorage.setItem('departmentData',JSON.stringify(new Department(this.f.departmentId.value,this.f.departmentName.value)));
      },
      err => {
        this.showLoader = false;
      }
    );
  }



  get f() { return this.assetForm.controls; }


  onSubmit() {
    this.submitted = true;
    if (this.assetForm.invalid) {
      console.log(this.assetForm);
      //this.submitted = false;
      return;
    }
     this.showLoader = true;
    switch (this.currentPage) {
      case 'add':
        this.addassetServiceCall();
        break;
      case 'edit':
        this.editassetServiceCall();
        break;
      default:
        break;
    }
  }
  addassetServiceCall() {

    this.assetService.createAsset(this.assetForm.value).subscribe(
      res => {
        this.showLoader = false;
        this.commonService.openSnackBar('Asset Created Successfully', 'badge-success');
        this.router.navigate(['index/sdxintelligence/assets']);
      },
      err => {
        this.showLoader = false;
        this.commonService.openSnackBar('Asset CREATION FAILED : ' + err.error.message, 'badge-danger');

      }
    );
  }
  editassetServiceCall() {
    this.assetService.updateAsset(this.f.assetId.value, this.assetForm.value).subscribe(
      res => {
        this.showLoader = false;
        this.commonService.openSnackBar('Asset - ' + this.f.assetName.value + ' Updated Successfully', 'badge-success');
        this.router.navigate(['index/sdxintelligence/assets'])

      },
      err => {
        this.showLoader = false;
        console.error(err);
        this.commonService.openSnackBar('ASSET UPDATE FAILED : ' + err.error.message, 'badge-danger');
      }
    );
  }

  locationAsset() {

    const dialogRef = this.dialog.open(LocationdialogComponent, { disableClose: true });
    dialogRef.afterClosed().subscribe(result => {
      const res = this.locationService.getLocationData();
    
        this.f.locationId.setValue(res.locationId); 
        this.f['locationName'].patchValue(res.locationName);
    
     
    });
  }
  contactAsset() {
    const dialogRef = this.dialog.open(ContactDialogComponent, { disableClose: true });
    dialogRef.afterClosed().subscribe(result => {
      const res = this.userService.getContactData();
      this.f.userId.setValue(res.userId);
      this.f['userName'].patchValue(res.userName);
    })

  }

  departmentAsset() {
    const dialogRef = this.dialog.open(DepartmentDialogComponent, { disableClose: true });
    dialogRef.afterClosed().subscribe(result => {

      const res = this.departmentService.getDepartmentData();
      this.f.departmentId.setValue(res.departmentId);
      this.f['departmentName'].patchValue(res.departmentName);

    })

  }
  manageAsset() {
    this.router.navigate(['index/sdxintelligence/assets'])
  }

  reset(){
    CommonService.resetPage(this.router);
  }
}

export class Location {
  private locationId :any;
  private locationName : any;
  constructor(locationId : any, locationName : any)
  {
    this.locationId = locationId;
    this.locationName = locationName;
  }
}
export class Department {
  private departmentId :any;
  private departmentName : any;
  constructor(departmentId : any, departmentName : any)
  {
    this.departmentId = departmentId;
    this.departmentName = departmentName;
  }
}
export class User {
  private userId :any;
  private userName : any;
  constructor(userId : any, userName : any)
  {
    this.userId = userId;
    this.userName = userName;
  }
}