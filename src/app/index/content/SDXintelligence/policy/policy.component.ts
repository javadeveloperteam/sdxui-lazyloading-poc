import { Component, OnInit } from '@angular/core';
import { PolicyService } from "../policy/services/policy.service";
import { FormBuilder, FormGroup, Validators, EmailValidator } from "@angular/forms";
import { CommonService } from 'src/app/common/services/common.service';
import { ActivatedRoute, Router } from "@angular/router";
import { GroupDestDialogComponent } from "../../dialog/group-dest-dialog/group-dest-dialog.component";
import { AssetDialogComponent } from "../../dialog/asset-dialog/asset-dialog.component";
import { RuleDialogComponent } from "../../dialog/rule-dialog/rule-dialog.component";
import { MatDialog } from '@angular/material/dialog';
import { DepartmentService } from "../../department/services/department.service"
import { EventService } from "../event/services/event.service";
import { ApplicationService } from "../application/services/application.service";
import { DepartmentDialogComponent } from '../asset/dialogbox/department-dialog/department-dialog.component';

@Component({
  selector: 'app-policy',
  templateUrl: './policy.component.html',
  styleUrls: ['./policy.component.css']
})
export class PolicyComponent implements OnInit {

  selectedAssets: any = [];
  selectedRules: any = [];
  selectedDests: any = [];
  selectedGroups: any = [];
  departments: any;
  departmentMap: any = {};
  policy: any;
  showLoader: Boolean = false;
  submitted: Boolean = false;
  policyForm: FormGroup;
  currentPage: String = "add";
  buttonName: String = "Create";
  events: any;
  applications: any;
  eventMap: any = {};
  applicationMap: any = {};
  selectedDepartment: any
  selectedDepartmentList: any = []
  selectDepartmentId: any;


  constructor(private formBuilder: FormBuilder,
    private policyService: PolicyService,
    private departmentService: DepartmentService,
    private eventService: EventService,
    private applicationService: ApplicationService,
    private route: ActivatedRoute,
    private router: Router,
    public dialog: MatDialog,
    private commonService: CommonService) {
    this.route.params.subscribe(params => this.currentPage = params['page']);
  }

  ngOnInit() {
    // Page should load with a loader
    this.showLoader = true;
    // Declare Form
    this.policyForm = this.formBuilder.group({
      policyId: [],
      policyName: ['', Validators.required],
      active: ['true', Validators.required],
      applicationName: [],
      eventName: [],
      applicationId: ['', Validators.required],
      eventId: ['', Validators.required],
      allAssetFlag: [false],
      rules: [],
      notifications: [],
      assetList: [],
      departmentId: [''],
      departmentName: [],
      comments: [],
      createdBy: [],
      createdByName: [],
      createdOn: []
    });
    this.departmentService.setDepartmentData('');

    // Patch Values if Edit
    console.log(this.currentPage);
    if (this.currentPage == "edit") {
      this.buttonName = "Update";
      let policyId = localStorage.getItem("policyId");
      if (policyId != null) {
        this.getPolicy(policyId);
      }
      else {
        this.router.navigate(['index/policies']);
      }
    }
    else {
      this.loadAllDepartment();
      this.loadAllApplication(null);
    }
  }


  onSubmit() {
    this.submitted = true;

    if (this.policyForm.invalid) {
      console.log('Mandatory fields missing');
      return;
    }
    let notification = [];
    let rule = [];

    // Set the Expression
    for (let i = 0; i < this.selectedDests.length; i++) {
      notification.push(new NotificationUDT(this.selectedDests[i].destinationId,
        this.selectedDests[i].destinationName, 'Destination'));
    }

    // Set Groups
    for (let i = 0; i < this.selectedGroups.length; i++) {
      notification.push(new NotificationUDT(this.selectedGroups[i].groupId,
        this.selectedGroups[i].groupName, 'Group'));
    }

    // Set Rules
    for (let i = 0; i < this.selectedRules.length; i++) {
      rule.push(new RuleUDT(this.selectedRules[i].ruleId,
        this.selectedRules[i].ruleName));
    }

    // Validation
    if (notification.length == 0) {
      return;
    }

    if (rule.length == 0) {
      return;
    }

    if (this.selectedAssets.length == 0 && !this.f.allAssetFlag.value) {
      return;
    }


    this.f.notifications.setValue(notification);
    this.f.assetList.setValue(this.selectedAssets);
    this.f.rules.setValue(rule);
    this.f.departmentName.setValue(this.selectedDepartment)
    this.f.departmentId.setValue(this.selectDepartmentId)

    this.f.applicationName.setValue(this.applicationMap[this.f.applicationId.value]);
    this.f.eventName.setValue(this.eventMap[this.f.eventId.value]);
    // if (this.f.departmentId.value != null) {
    //   this.f.departmentName.setValue(this.departmentMap[this.f.departmentId.value]);
    // }


    if (this.currentPage == "edit") {
      this.updatePolicy();
    }
    else {
      this.savePolicy();
    }
  }

  getPolicy(policyId: any) {
    this.policyService.getPolicy(policyId).subscribe(
      res => {
        console.log(res);
        this.policy = res;
        this.loadAllDepartment();
        this.loadAllApplication(this.policy.applicationId);
        this.loadAllEventByApp(this.policy.applicationId, this.policy.eventId);

        let notification = this.policy.notifications;
        for (let i = 0; i < notification.length; i++) {
          if (notification[i].notificationType == 'Destination') {
            this.selectedDests.push(new Destination(notification[i].notificationId, notification[i].notificationName));
          }
          else if (notification[i].notificationType == 'Group') {
            this.selectedGroups.push(new Group(notification[i].notificationId, notification[i].notificationName));
          }
        }
        this.selectedAssets = this.policy.assetList;
        this.selectedRules = this.policy.rules;
        this.selectedDepartment = this.policy.departmentName;
        this.selectDepartmentId = this.policy.departmentId;
        if (this.policy.rules == null) {
          this.selectedRules = [];
        }
        else {
          this.selectedRules = this.policy.rules;
        }
        this.policyForm.patchValue(this.policy);
        localStorage.setItem('departmentData', JSON.stringify(new Department(this.f.departmentId.value,
          this.f.departmentName.value)));
        this.assetFlagChange();

      },
      err => {
        console.log("Error occured");
        this.showLoader = false;
        console.log(err);
        this.commonService.openSnackBar('Policy Load Failed : ' + err.error.message, 'badge-danger');
      }
    );
  }

  savePolicy() {
    console.log(this.policyForm.value);
    this.showLoader = true;
    this.policyService.createPolicy(this.policyForm.value).subscribe(
      res => {
        console.log(res);
        this.showLoader = false;
        this.commonService.openSnackBar("Policy Created Successfully", 'badge-success');
        this.router.navigate(['index/sdxintelligence/policies']);
      },
      err => {
        this.showLoader = false;
        console.log("Error occured");
        console.log(err);
        this.commonService.openSnackBar('Policy Creation Failed : ' + err.error.message, 'badge-danger');
      }
    );
  }

  updatePolicy() {
    this.showLoader = true;
    this.policyService.updatePolicy(this.policyForm.value).subscribe(
      res => {
        console.log(res);
        this.showLoader = false;
        this.commonService.openSnackBar("Policy Updated Successfully", 'badge-success');
        this.router.navigate(['index/sdxintelligence/policies']);
      },
      err => {
        this.showLoader = false;
        console.log("Error occured");
        console.log(err);
        this.commonService.openSnackBar('Policy Update Failed : ' + err.error.message, 'badge-danger');
      }
    );
  }

  assetFlagChange() {
    console.log(this.f.allAssetFlag.value);

    if (this.f.allAssetFlag.value) {
      $('#assetDiv').attr('disabled', 'disabled');
      this.selectedAssets = [];
    }
    else {
      $('#assetDiv').removeAttr('disabled');
    }
  }


  loadAllEventByApp(applicationId: any, eventId: any) {
    this.eventService.getAllEventsByApplication(applicationId).subscribe(
      res => {
        console.log(res);
        this.events = res;
        if (eventId != null) {
          this.f.eventId.setValue(eventId);
        }

        for (let i = 0; i < this.events.length; i++) {
          this.eventMap[this.events[i].eventId] = this.events[i].eventName;
        }
        console.log(this.applications);
        if (this.applications != undefined) {
          // Should not stop before application call
          this.showLoader = false;
        }

      },
      err => {
        this.showLoader = false;
        this.commonService.openSnackBar('Event Load Failed', 'badge-danger');
        console.log("Error occured");
      }
    );
  }

  loadAllApplication(applicationId: any) {
    this.applicationService.getAllApplication().subscribe(
      res => {
        console.log(res);
        this.applications = res;
        if (applicationId != null) {
          this.f.applicationId.setValue(applicationId);
        }

        for (let i = 0; i < this.applications.length; i++) {
          this.applicationMap[this.applications[i].applicationId] = this.applications[i].applicationName;
        }
        this.showLoader = false;
      },
      err => {
        this.showLoader = false;
        this.commonService.openSnackBar('Application Load Failed', 'badge-danger');
        console.log("Error occured");
      }
    );
  }


  openDestinationPopUp() {

    // Set in Local Storage
    localStorage.setItem("selectedDests", JSON.stringify(this.selectedDests));
    localStorage.setItem("selectedGroups", JSON.stringify(this.selectedGroups));

    // Open Dialog
    const dialogRef = this.dialog.open(GroupDestDialogComponent, {
      disableClose: true,
      data: { type: null }
    });

    // On close
    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
      console.log(dialogRef.componentInstance.groupSelection.selected);
      console.log(dialogRef.componentInstance.destinationSelection.selected);
      this.selectedDests = dialogRef.componentInstance.selectedDests;
      this.selectedGroups = dialogRef.componentInstance.selectedGrps;
    });
  }

  openAssetPopUp() {

    // Set in Local Storage
    localStorage.setItem("selectedAssets", JSON.stringify(this.selectedAssets));

    // Open Dialog
    const dialogRef = this.dialog.open(AssetDialogComponent, { disableClose: true });

    // On close
    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
      this.selectedAssets = dialogRef.componentInstance.selectedAssets;      
    });
  }

  openRulePopUp() {
    if (this.f.eventId.value == null) {
      this.commonService.openSnackBar('Event Name is Empty', 'badge-danger');
      return;
    }
    // Set in Local Storage
    localStorage.setItem("selectedRules", JSON.stringify(this.selectedRules));
    localStorage.setItem("eventId", this.f.eventId.value);

    // Open Dialog
    const dialogRef = this.dialog.open(RuleDialogComponent, { disableClose: true });

    // On close
    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
      this.selectedRules = dialogRef.componentInstance.selectedRules;
      
    });
  }

  loadAllDepartment() {
    this.departmentService.getAllDepartment().subscribe(
      res => {
        console.log(res);
        this.departments = res;
        for (let i = 0; i < this.departments.length; i++) {
          this.departmentMap[this.departments[i].departmentId] = this.departments[i].departmentName;
        }
        if (this.policy != undefined) {
          console.log(this.policy.departmentId);
          this.f.departmentId.setValue(this.policy.departmentId);
        }
      },
      err => {
        this.showLoader = false;
        this.commonService.openSnackBar('Department Load Failed', 'badge-danger');
        console.log("Error occured");
      }
    );
  }
  opendepartmentPopUp() {
    let departmentListData = {
      departmentId: this.selectDepartmentId,
      departmentName: this.selectedDepartment
    }
    localStorage.setItem('departmentData', JSON.stringify(departmentListData));

    const dialogRef = this.dialog.open(DepartmentDialogComponent, { disableClose: true });
    dialogRef.afterClosed().subscribe(result => {

      const res = this.departmentService.getDepartmentData();
      this.selectedDepartmentList = dialogRef.componentInstance.selectDepartment;
      if (this.selectedDepartmentList != undefined && this.selectedDepartmentList != null && this.selectedDepartmentList != '') {
        this.selectedDepartment = this.selectedDepartmentList[0].departmentName
        this.selectDepartmentId = this.selectedDepartmentList[0].departmentId
      }
      else{
        this.selectedDepartment = '';
        this.selectDepartmentId  = ''
      }

    })
  }

  get f() { return this.policyForm.controls; }

  onChangeEvent() {
    this.selectedRules = [];
  }

  clear() {
    CommonService.resetPage(this.router);
  }
  onChangeApp() {
    this.selectedRules = [];
    this.f.eventId.setValue('');
  }

  removeDestination(id) {
    for (let i = 0; i < this.selectedDests.length; i++) {
      if (this.selectedDests[i].destinationId == id) {
        this.selectedDests.splice(i, 1);
      }
    }
  }

  removeGroup(id) {
    for (let i = 0; i < this.selectedGroups.length; i++) {
      if (this.selectedGroups[i].groupId == id) {
        this.selectedGroups.splice(i, 1);
      }
    }
  }
  removeAsset(id) {
    for (let i = 0; i < this.selectedAssets.length; i++) {
      if (this.selectedAssets[i].assetId == id) {
        this.selectedAssets.splice(i, 1);
      }
    }
  }
  
  removeRule(id) {
    for (let i = 0; i < this.selectedRules.length; i++) {
      if (this.selectedRules[i].ruleId == id) {
        this.selectedRules.splice(i, 1);
      }
    }
  }
  removeDepartment() {
    this.selectedDepartment = null;
    this.selectDepartmentId = null;
  }
}


export class NotificationUDT {
  notificationId: any;
  notificationName: any;
  notificationType: any;

  constructor(notificationId: any, notificationName: any, notificationType: any) {
    this.notificationId = notificationId;
    this.notificationName = notificationName;
    this.notificationType = notificationType;
  }

}

export class RuleUDT {
  ruleId: any;
  ruleName: any;

  constructor(ruleId: any, ruleName: any) {
    this.ruleId = ruleId;
    this.ruleName = ruleName;
  }
}
export class Department {
  departmentId: any;
  departmentName: any;
  constructor(departmentId: any, departmentName: any) {
    this.departmentId = departmentId;
    this.departmentName = departmentName;
  }
}
export class Destination {
  destinationId: any;
  destinationName: any;

  constructor(destinationId: any, destinationName: any) {
    this.destinationId = destinationId;
    this.destinationName = destinationName;
  }
}
export class Group {
  groupId: any;
  groupName: any;

  constructor(groupId: any, groupName: any) {
    this.groupId = groupId;
    this.groupName = groupName;
  }
}