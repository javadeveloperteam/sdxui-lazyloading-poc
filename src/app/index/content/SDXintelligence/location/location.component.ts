import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonService } from 'src/app/common/services/common.service';
import { LocationsService } from './services/locations.service';
import { UsersService } from '../../users/services/users.service';


@Component({
  selector: 'app-location',
  templateUrl: './location.component.html',
  styleUrls: ['./location.component.css']
})
export class LocationComponent implements OnInit {

  showLoader: Boolean = false;
  editData: any
  addForm: FormGroup;
  submitted: boolean;
  currentPage: string;
  localLocation: any = []
  LocationId: number;
  getEditValues: any = [];
  zipCodeMap: any = {};
  stateMap: any = {};
  countryMap: any = {};
  countryList: any;
  stateList: any;
  cityList: any;
  LocationHeader: string;
  constructor(private formBuilder: FormBuilder, private router: Router,
    private locationService: LocationsService, private route: ActivatedRoute,
    private commonService: CommonService, private userService: UsersService) {
    this.route.params.subscribe(params => this.currentPage = params['page']);
  }

  ngOnInit() {
    this.localLocation = JSON.parse(localStorage.getItem('location'))
    this.showLoader = true;
    this.addForm = this.formBuilder.group({
      locationName: ['', Validators.required],
      addressLine1: ['', Validators.required],
      addressLine2: [''],
      country: ['', Validators.required],
      state: ['', Validators.required],
      city: ['', Validators.required],
      countryName: [''],
      stateName: [''],
      zipCode: ['', Validators.required],
      active : ['true'],
      comments: ['']
    })


    switch (this.currentPage) {
      case 'add':
        this.LocationHeader = "Create Location"
        this.loadCountries(false)
        break;
      case 'edit':
        this.LocationHeader = "Update Location"
        this.editData = JSON.parse(localStorage.getItem('locationEdit'))
        this.LocationId = this.editData.locationId
        this.getEditData();
        break;
      default:
        break;
    }
  }

  get f() { return this.addForm.controls; }

  getEditData() {
    this.locationService.EditLocation(this.LocationId).subscribe(
      res => {
        this.getEditValues = res
        this.showLoader = false;
        
        this.addForm.patchValue(this.getEditValues);
        this.loadCountries(true)
      },
      err => {
        this.showLoader = false;
      }
    );
  }
  loadCountries(editMode) {
    this.showLoader = true;
    this.userService.getCountries().subscribe(
      (result: Array<Object>) => {
        this.showLoader = false;
        this.countryList = result;

        this.countryMap = {};
        result.forEach(obj => {
          this.countryMap[obj['country']] = obj['countryName'];
        });

        if (editMode) {
          this.addForm.get('country').setValue(this.getEditValues.country);
          this.loadStates(this.getEditValues.country, editMode);
      }

  /*       let selectedCountry = "";
        if (this.countryList.length > 0) {
          selectedCountry = editMode ? this.getEditValues.country : this.countryList[0]['country'];
        }
        this.addForm.get('country').setValue(selectedCountry);
        // alert(this.addForm.value)
        this.loadStates(selectedCountry, editMode); */
      }
    )
  }
  loadStates(country, editMode) {
    this.showLoader = true;
    this.userService.getStates(country).subscribe(
      (result: Array<Object>) => {
        this.showLoader = false;
        this.stateList = result;
        this.stateMap = {};
        result.forEach(obj => {
          this.stateMap[obj['state']] = obj['stateName'];
        });

        if (editMode) {
          this.addForm.get('state').setValue(this.getEditValues.state);
          this.loadCities(country, this.getEditValues.state, editMode);
      } else {
          this.cityList = [];
          this.zipCodeMap = {};
          this.addForm.get('state').reset();
          this.addForm.get('city').reset();
          this.addForm.get('zipCode').reset();
      }

       /*  let selectedState = "";
        if (this.stateList.length > 0) {
          selectedState = editMode ? this.getEditValues.state : this.stateList[0]['state'];
        }
        this.addForm.get('state').setValue(selectedState);
        this.loadCities(country, selectedState, editMode) */
      })
  }
  loadCities(countryCode, stateCode, editMode): any {
    this.showLoader = true;
    //let userForm = { "country": countryCode, "state": stateCode };
    this.userService.getCities(stateCode).subscribe(
      (result: Array<Object>) => {
        this.showLoader = false;
        this.cityList = result;
        let selectedCity = "";

        this.zipCodeMap = {};
        if (typeof result != undefined && result != null) {
          result.forEach(obj => {
            this.zipCodeMap[obj['city']] = obj['zipCode'];
          });
          this.cityList = result;
        }

        if (editMode) {
          this.addForm.get('city').setValue(this.getEditValues.city);
          this.setZipCode(this.getEditValues.city);
      } else {
          this.addForm.get('city').reset();
          this.addForm.get('zipCode').reset();
      }

       /*  if (this.cityList.length > 0) {
          selectedCity = editMode ? this.getEditValues.city : this.cityList[0]['city'];
        }
        this.addForm.get('city').setValue(selectedCity);
        this.setZipCode(selectedCity);
 */
      },
      err => {
        this.showLoader = false;
        console.log("loading cities failed");
      }
    )
  }
  onSubmit() {
    this.submitted = true;
    if (this.addForm.invalid) {
      console.log(this.addForm);
      //this.submitted = false;
      return;
    }
    this.showLoader = true;

    const location = this.addForm.value;
    console.info(location);
    location['countryName'] = this.countryMap[location['country']];
    location['stateName'] = this.stateMap[location['state']];

    switch (this.currentPage) {
      case 'add':
        this.addlocationServiceCall(location);
        break;
      case 'edit':
        this.editlocationServiceCall(location);
        break;
      default:
        break;
    }
  }
  addlocationServiceCall(addLoc) {

    this.locationService.createLocation(JSON.stringify(addLoc)).subscribe(
      res => {
        this.showLoader = false;
        this.commonService.openSnackBar('Location Created Successfully', 'badge-success');
        this.router.navigate(['index/sdxintelligence/locations'])


      },
      err => {
        this.showLoader = false;
        this.commonService.openSnackBar('LOCATION CREATION FAILED : ' + err.error.message, 'badge-danger');

      }
    );

  }
  editlocationServiceCall(editLoc) {
    editLoc['locationId'] = this.LocationId
    this.locationService.updateLocation(this.LocationId, JSON.stringify(editLoc)).subscribe(
      res => {
        this.showLoader = false;
        this.commonService.openSnackBar('Location - ' + editLoc['locationName'] + ' Updated Successfully', 'badge-success');
        this.router.navigate(['index/sdxintelligence/locations'])

      },
      err => {
        this.showLoader = false;
        console.error(err);
        this.commonService.openSnackBar('LOCATION UPDATE FAILED : ' + err.error.message, 'badge-danger');
      }
    );
  }
  managelocation() {
    this.router.navigate(['index/sdxintelligence/locations'])

  }

  reset()
  {
    CommonService.resetPage(this.router);
  }

  setZipCode(city: any) {
    if (typeof city != "undefined" && city != "" && city != null && city != "null"){
      this.addForm.controls['zipCode'].setValue(this.zipCodeMap[city])
    }
    else{
      this.addForm.controls['zipCode'].setValue("");
      this.addForm.get('city').reset();
    }
  }

}
