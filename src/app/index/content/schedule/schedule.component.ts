import { Component, OnInit } from '@angular/core';
import { ScheduleService } from "../schedule/services/schedule.service";
import { UsersService } from "../users/services/users.service";
import { FormBuilder, FormGroup, Validators, EmailValidator } from "@angular/forms";
import { CommonService } from 'src/app/common/services/common.service';
import { ActivatedRoute, Router } from "@angular/router";
import { UserDialogComponent } from "../dialog/user-dialog/user-dialog.component";
import { MatDialog } from '@angular/material/dialog';
import { logging } from 'protractor';
import { UserGroupDialogComponent } from '../dialog/user-group-dialog/user-group-dialog.component';

@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.css']
})
export class ScheduleComponent implements OnInit {


  showLoader: Boolean = false;
  submitted: Boolean = false;
  scheduleForm: FormGroup;
  scheduleTimeContent: String = '';
  supervisors: any;
  department: any;
  currentPage: String = "add";
  buttonName: String = "Create";
  todayDate : any;
  timepicker1:any;
  timepicker2:any;
  timepicker3:any;
  timepicker4:any;
  selectedUsers: any = [];
  selectedGroups: any = [];
  constructor(
    private formBuilder: FormBuilder,
    private scheduleService: ScheduleService,
    private usersService: UsersService,
    private route: ActivatedRoute,
    private router: Router,
    public dialog: MatDialog,
    private commonService: CommonService) {
    this.route.params.subscribe(params => this.currentPage = params['page']);
  }

  ngOnInit() {
    
    // Page should start with loader
    this.showLoader = true;

    this.todayDate = new Date();

    // Declare Form
    this.scheduleForm = this.formBuilder.group({
      scheduleId:[],
      scheduleName: ['', Validators.required],
      scheduleStartTime1: [0, Validators.required],
      scheduleStartTime2: [0, Validators.required],
      scheduleEndTime1: [0, Validators.required],
      scheduleEndTime2: [0, Validators.required],
      scheduleTime: ['', Validators.required],
      userGroup: [null, Validators.required],
      occurrenceType: ['Daily'],
      startDate: [null, Validators.required],
      endDate: [null, Validators.required],
      comments: [null],
      intervalDay: [0],
      active: ['true'],
      createdBy: [],
      createdByName: [],
      createdOn: []
    });

    // Patch Values if Edit
    console.log(this.currentPage);
    if (this.currentPage == "edit") {
      this.buttonName = "Update";
      let scheduleId = localStorage.getItem("scheduleId");
      if (scheduleId != null) {
        this.getSchedule(scheduleId);
      }
      else {
        this.router.navigate(['index/schedules']);
      }
    }
    else
    {
      this.showLoader = false;
    }
  }


  getSchedule(scheduleId: any) {
    this.scheduleService.getSchedule(scheduleId).subscribe(
      res => {
        console.log(res);
        this.department = res;
        this.scheduleForm.patchValue(this.department);
        let userArray: any = [];
        let groupArray: any = [];
        let scheduleArray = this.department.scheduleDetails;
        for (let i = 0; i < scheduleArray.length; i++) {
          this.f.startDate.setValue(new Date(scheduleArray[i].startDate));
          this.f.endDate.setValue(new Date(scheduleArray[i].endDate));
          this.f.scheduleTime.setValue(scheduleArray[i].scheduleTime);
          this.f.intervalDay.setValue(scheduleArray[i].intervalDay);
          let tempUsr = {};
          let tempGrp = {};
          if(scheduleArray[i].userId !=null && scheduleArray[i].userName != null)
          {
            tempUsr['userId'] = scheduleArray[i].userId;
            tempUsr['userName'] = scheduleArray[i].userName;
            userArray.push(tempUsr);
          }
          if(scheduleArray[i].groupId != null && scheduleArray[i].groupName != null)
          {
            tempGrp['groupId'] = scheduleArray[i].groupId;
            tempGrp['groupName'] = scheduleArray[i].groupName;
            groupArray.push(tempGrp);
          }
        }

        this.scheduleTimeContent = this.f.scheduleTime.value;
      
        this.selectedGroups = groupArray;
        this.selectedUsers = userArray;
        this.showLoader = false;

        // Split Schedule Data
      },
      err => {
        console.log("Error occured");
        this.showLoader = false;
        console.log(err);
        this.commonService.openSnackBar('Schedule Load Failed : '+err.error.message, 'badge-danger');
      }
    );
  }

  onSubmit() {
    this.submitted = true;
    if (this.scheduleForm.invalid) {
      console.log(this.scheduleForm);
      console.info('Mandatory Fields Missing');
      return;
    }

    // End date validation
    if(this.f.endDate.value < this.f.startDate.value)
    {
      this.scheduleForm.controls.endDate.setErrors({pattern:'Invalid'});
      return;
    }

    // stop here if form is invalid
    if(this.f.occurrenceType.value != 'Customize')
    {
      this.f.intervalDay.setValue('0');
    }

    const schedule = {};
    schedule['scheduleId'] = this.f.scheduleId.value;
    schedule['scheduleName'] = this.f.scheduleName.value;
    schedule['active'] = this.f.active.value;
    schedule['occurrenceType'] = this.f.occurrenceType.value;
    schedule['comments'] = this.f.comments.value;
    schedule['timeZone'] = this.commonService.getTimeZone();
    schedule['createdBy'] = this.f.createdBy.value;
    schedule['createdByName'] = this.f.createdByName.value;
    schedule['createdOn'] = this.f.createdOn.value;
    
    let users = this.selectedUsers;
    let grps = this.selectedGroups;
    // Form schedule details Array
    let scheduleArray = new Array();
    for (let i = 0; i < users.length; i++) {
      scheduleArray.push(new ScheduleDetails(this.f.scheduleName.value, users[i].userId, users[i].userName,
        null,null,this.scheduleTimeContent, this.f.intervalDay.value, this.f.occurrenceType.value,
        this.f.startDate.value.toLocaleDateString(), this.f.endDate.value.toLocaleDateString(), 'User',
        this.f.active.value,schedule['timeZone']));
    }

    for (let i = 0; i < grps.length; i++) {
      scheduleArray.push(new ScheduleDetails(this.f.scheduleName.value, null, null,
        grps[i].groupId,grps[i].groupName,this.scheduleTimeContent, this.f.intervalDay.value, this.f.occurrenceType.value,
        this.f.startDate.value.toLocaleDateString(), this.f.endDate.value.toLocaleDateString(), 'Group',
        this.f.active.value,schedule['timeZone']));
    }

    schedule['scheduleDetails'] = scheduleArray;
    console.info(schedule);

    if (this.currentPage == "edit") {
      this.updateSchedule(schedule);
    }
    else {
      this.saveSchedule(schedule);
    }
  }

  saveSchedule(schedule: any) {
    this.showLoader = true;
    this.scheduleService.createSchedule(schedule).subscribe(
      res => {
        this.showLoader = false;
        console.log(res);
        this.commonService.openSnackBar("Schedule Created Successfully", 'badge-success');
        this.router.navigate(['index/schedules']);
      },
      err => {
        this.showLoader = false;
        console.error(err);
        console.log("Error occured");
        this.commonService.openSnackBar("Schedule Creation Failed : "+err.error.message, 'badge-danger');
      }
    );
  }


  updateSchedule(schedule: any) {
    this.showLoader = true;
    this.scheduleService.updateSchedule(schedule).subscribe(
      res => {
        this.showLoader = false;
        console.log(res);
        this.commonService.openSnackBar("Schedule Updated Successfully", 'badge-success');
        this.router.navigate(['index/schedules']);
      },
      err => {
        this.showLoader = false;
        console.error(err);
        console.log("Error occured");
        this.commonService.openSnackBar("Schedule Update Failed : "+err.error.message, 'badge-danger');
      }
    );
  }

  addTime() {
    let startTime1 = this.f.scheduleStartTime1.value;
    let startTime2 = this.f.scheduleStartTime2.value;
    let endTime1 = this.f.scheduleEndTime1.value;
    let endTime2 = this.f.scheduleEndTime2.value;

     if(startTime1 > endTime1)
    {
      this.scheduleForm.controls.scheduleEndTime1.setErrors({pattern:'Invalid'});
      return;
    }else if(startTime1 == endTime1)
    {
      if(startTime2 > endTime2)
      {
        this.scheduleForm.controls.scheduleEndTime2.setErrors({pattern:'Invalid'});
        return;
      }
    } 
    let temp = this.appendZero(startTime1) + ":" + this.appendZero(startTime2) + "-" + this.appendZero(endTime1) + ":" + this.appendZero(endTime2);

    if (this.scheduleTimeContent == '') {
      this.scheduleTimeContent =   temp;
    }
    else {
      this.scheduleTimeContent = this.scheduleTimeContent + ","  + temp;
    }
    this.f.scheduleTime.setValue(this.scheduleTimeContent);

  }

  appendZero(val)
  {
    return val > 9 ? val : '0'+val;
  }

  clearTime() {
    this.f.scheduleStartTime1.setValue(0);
    this.f.scheduleStartTime2.setValue(0);
    this.f.scheduleEndTime1.setValue(0);
    this.f.scheduleEndTime2.setValue(0);
    this.scheduleTimeContent = '';
    this.f.scheduleTime.setValue(this.scheduleTimeContent);
  }


  openUserGroupPopUp() {
    localStorage.setItem("selectedUsers", JSON.stringify(this.selectedUsers));
    localStorage.setItem("selectedGroups", JSON.stringify(this.selectedGroups));
    const dialogRef = this.dialog.open(UserGroupDialogComponent, { disableClose: true });
    dialogRef.afterClosed().subscribe(result => {
    console.log(`Dialog result: ${result}`);
    console.log(dialogRef.componentInstance.selectedUsers);
    console.log(dialogRef.componentInstance.selectedGrps);
    this.selectedGroups = dialogRef.componentInstance.selectedGrps;
    this.selectedUsers = dialogRef.componentInstance.selectedUsers;
    if (this.selectedUsers.length > 0 || this.selectedGroups.length > 0) {
      this.f.userGroup.setValue(1);
    }
    else
    {
        this.f.userGroup.setValue(null);
    }
    });
  }
 
  ScheduleTime(){
    
    this.timepicker1 = $('#timepicker1').val();
    this.timepicker2 = $('#timepicker3').val();
if(this.timepicker1 <= 24  ){
  var num1 = parseInt(this.timepicker1, 10);
  this.f.scheduleStartTime1.setValue( num1.toString())
}else {
 
this.f.scheduleStartTime1.setValue(0)
}
if( this.timepicker2 <= 24){
  var num2 = parseInt(this.timepicker2, 10);
  this.f.scheduleEndTime1.setValue( num2.toString())
}else {
 
this.f.scheduleEndTime1.setValue(0)
}
  }

  ScheduleMins(){
    this.timepicker3 = $('#timepicker2').val();
    this.timepicker4 = $('#timepicker4').val();
if(this.timepicker3 <= 59){
  var num3 = parseInt(this.timepicker3, 10);
  this.f.scheduleStartTime2.setValue(num3.toString())
}else {
 
this.f.scheduleStartTime2.setValue(0)
}
if(this.timepicker4  <= 59){
  var num4 = parseInt(this.timepicker4, 10);
  this.f.scheduleEndTime2.setValue(num4.toString() )
}else {
 
this.f.scheduleEndTime2.setValue(0)
}
  }

  reset() {
      CommonService.resetPage(this.router);
  }

  removeUser(id) {
    for (let i = 0; i < this.selectedUsers.length; i++) {
      if (this.selectedUsers[i].userId == id) {
        this.selectedUsers.splice(i, 1);
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


  get f() { return this.scheduleForm.controls; }
}



class ScheduleDetails {
  scheduleName: String;
  userId: Number;
  userName: String;
  groupId: String;
  groupName: String;
  scheduleTime: String;
  intervalDay: Number;
  occurrenceType: String;
  startDate: String;
  endDate: String;
  entity: String;
  active: Boolean;
  timeZone : any;
  constructor(scheduleName: String, userId: Number, userName: String, groupId: String, groupName: String, scheduleTime: String,
    intervalDay: Number, occurrenceType: String, startDate: String, endDate: String, entity: String,
     active: Boolean, timeZone :any) {
    this.scheduleName = scheduleName;
    this.userId = userId;
    this.userName = userName;
    this.groupId = groupId;
    this.groupName = groupName;
    this.scheduleTime = scheduleTime;
    this.intervalDay = intervalDay;
    this.occurrenceType = occurrenceType;
    this.startDate = startDate;
    this.endDate = endDate;
    this.entity = entity;
    this.active = active;
    this.timeZone = timeZone;
  }

}