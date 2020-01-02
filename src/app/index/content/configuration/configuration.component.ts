import { Component, OnInit } from '@angular/core';
import { ConfigurationService } from "../configuration/services/configuration.service";
import { FormBuilder, FormGroup, Validators, EmailValidator } from "@angular/forms";
import { CommonService } from 'src/app/common/services/common.service';
import { ActivatedRoute, Router } from "@angular/router";

@Component({
  selector: 'app-configuration',
  templateUrl: './configuration.component.html',
  styleUrls: ['./configuration.component.css']
})
export class ConfigurationComponent implements OnInit {
  showLoader: Boolean = false;
  disableSaveBtn: boolean = true;
  submitted: Boolean = false;
  configurationForm: FormGroup;
  currentPage: String = "add";
  buttonName: String = "Create";
  constructor(
    private formBuilder: FormBuilder,
    private configurationService: ConfigurationService,
    private route: ActivatedRoute,
    private router: Router,
    private commonService: CommonService) {
    this.route.params.subscribe(params => this.currentPage = params['page']);
  }


  ngOnInit() {
    // Page should load with loader
    this.showLoader = true;
    // Declare Form
    this.configurationForm = this.formBuilder.group({
      configurationId: [],
      configurationName: ['', Validators.required],
      active: ['true', Validators.required],
      type: ['Email', Validators.required],
      fromId: [''],
      fromName: [''],
      hostAddress: [''],
      userName: [''],
      password: [''],
      accountSID: [''],
      authToken: [''],
      portTLS: [''],
      portSLS: [''],
      comments: [''],
      requestUrl: [''],
      responseUrl: [''],
      testConfigurationId: ['', Validators.required],
      createdBy: [],
      createdByName: [],
      createdOn: []
    });

    // Patch Values if Edit
    console.log(this.currentPage);
    if (this.currentPage == "edit") {
      this.buttonName = "Update";
      let configurationId = localStorage.getItem("configurationId");
      if (configurationId != null) {
        this.getConfiguration(configurationId);
      }
      else {
        this.router.navigate(['index/configurations']);
      }
    }
    else {
      this.showLoader = false;
      // Enable Fields based on Type
      this.resetValidators(this.f.type.value);
    }
  }

  getConfiguration(configurationId: any) {
    let configuration = {};
    configuration = this.configurationService.getConfiguration(configurationId).subscribe(
      res => {
        console.log(res);
        let configuration = res;
        this.configurationForm.patchValue(configuration);
        // Enable Fields based on Type
        this.resetValidators(this.f.type.value);
        this.showLoader = false;
      },
      err => {
        console.log("Error occured");
        this.showLoader = false;
        console.log(err);
        this.commonService.openSnackBar('Configuration Load Failed: '+err.error.message, 'badge-danger');
      }
    );
  }

  testConnection() {
    this.submitted = true;
    if (this.configurationForm.invalid) {
      console.log('Mandatory fields missing');
      console.log(this.configurationForm);
      return;
    }
    this.showLoader = true;
    this.configurationService.testConfiguration(this.configurationForm.value).subscribe(
      res => {
        console.log(res);
        this.commonService.openSnackBar("Configuration Tested Successfully", 'badge-success');
        this.disableSaveBtn = false;
        this.showLoader = false;
      },
      err => {
        this.showLoader = false;
        console.log("Error occured");
        console.log(err);
        this.commonService.openSnackBar('Configuration Test Failed: '+err.error.message, 'badge-danger');
      }
    );
  }

  onSubmit() {
    if (this.currentPage == "edit") {
      this.updateConfiguration();
    }
    else {
      this.saveConfiguration();
    }
  }
  saveConfiguration() {
    this.submitted = true;

    if (this.configurationForm.invalid) {
      console.log('Mandatory fields missing');
      return;
    }
    this.showLoader = true;
    this.configurationService.createConfiguration(this.configurationForm.value).subscribe(
      res => {
        console.log(res);
        this.showLoader = false;
        this.disableSaveBtn = true;
        this.commonService.openSnackBar("Configuration Created Successfully", 'badge-success');
        this.router.navigate(['index/configurations']);
      },
      err => {
        this.showLoader = false;
        console.log("Error occured");
        console.log(err);
        this.commonService.openSnackBar('Configuration Creation Failed : '+err.error.message, 'badge-danger');
      }
    );
  }
  updateConfiguration() {
    this.submitted = true;

    if (this.configurationForm.invalid) {
      console.log('Mandatory fields missing');
      return;
    }
    this.showLoader = true;
    this.configurationService.updateConfiguration(this.configurationForm.value).subscribe(
      res => {
        console.log(res);
        this.showLoader = false;
        this.disableSaveBtn = true;
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
  
  resetValidators(configType: String) {
   console.log(configType);
    if (configType == "Email") {
      this.f.hostAddress.setValidators([Validators.required]);
      this.f.fromId.setValidators([Validators.required]);
      this.f.fromName.setValidators([Validators.required]);
      this.f.portTLS.setValidators([Validators.required]);
      this.f.userName.setValidators([Validators.required]);
      this.f.password.setValidators([Validators.required]);
      this.f.authToken.setValidators([]);
      this.f.requestUrl.setValidators([]);
      this.f.responseUrl.setValidators([]);
    } else {
      this.f.requestUrl.setValidators([Validators.required]);
      this.f.responseUrl.setValidators([Validators.required]);
      this.f.authToken.setValidators([Validators.required]);
      this.f.hostAddress.setValidators([]);
      this.f.fromId.setValidators([]);
      this.f.fromName.setValidators([]);
      this.f.portTLS.setValidators([]);
      this.f.userName.setValidators([]);
      this.f.password.setValidators([]);
    }
    this.f.requestUrl.updateValueAndValidity();
    this.f.responseUrl.updateValueAndValidity();
    this.f.fromId.updateValueAndValidity();
    this.f.fromName.updateValueAndValidity();
    this.f.portTLS.updateValueAndValidity();
    this.f.userName.updateValueAndValidity();
    this.f.password.updateValueAndValidity();
    this.f.hostAddress.updateValueAndValidity();
  }
  reset() {
    CommonService.resetPage(this.router);
  }
  // convenience getter for easy access to form fields
  get f() { return this.configurationForm.controls; }

}
