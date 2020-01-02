import { Component, OnInit } from '@angular/core';
import { DepartmentService } from "../department/services/department.service";
import { UsersService } from "../users/services/users.service";
import { FormBuilder, FormGroup, Validators, EmailValidator } from "@angular/forms";
import { CommonService } from 'src/app/common/services/common.service';
import { ActivatedRoute, Router } from "@angular/router";
import { UserDialogComponent } from "../dialog/user-dialog/user-dialog.component";
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-department',
  templateUrl: './department.component.html',
  styleUrls: ['./department.component.css']
})
export class DepartmentComponent implements OnInit {


  showLoader: Boolean = false;
  submitted: Boolean = false;
  departmentForm: FormGroup;
  supervisors: any;
  department: any;
  supervisorMap = {};
  currentPage: String = "add";
  buttonName: String = "Create";
  constructor(
    private formBuilder: FormBuilder,
    private departmentService: DepartmentService,
    private usersService: UsersService,
    private route: ActivatedRoute,
    private router: Router,
    public dialog: MatDialog,
    private commonService: CommonService) {
    this.route.params.subscribe(params => this.currentPage = params['page']);
  }


  ngOnInit() {
    // Page should load with loader
    this.showLoader = true;
    // Declare Form
    this.departmentForm = this.formBuilder.group({
      departmentId: [],
      departmentName: ['', Validators.required],
      active: ['true', Validators.required],
      supervisorId: ['', Validators.required],
      supervisorName: [''],
      users: [null, Validators.required],
      comments: [''],
      createdBy: [],
      createdByName: [],
      createdOn: []
    });

    // Patch Values if Edit
    console.log(this.currentPage);
    if (this.currentPage == "edit") {
      this.buttonName = "Update";
      let departmentId = localStorage.getItem("departmentId");
      if (departmentId != null) {
        this.getDepartment(departmentId);
      }
      else {
        this.router.navigate(['index/departments']);
      }
    }
    else {
      this.showLoader = false;
      this.loadAllSupervisorUsers(null);
    }
  }

  getDepartment(departmentId: any) {
    this.departmentService.getDepartment(departmentId).subscribe(
      res => {
        console.log(res);
        this.department = res;
        this.departmentForm.patchValue(this.department);
        this.loadAllSupervisorUsers(this.department.departmentId);
      },
      err => {
        console.log("Error occured");
        this.showLoader = false;
        console.log(err);
        this.commonService.openSnackBar('Department Load Failed : ' + err.error.message, 'badge-danger');
      }
    );
  }

  loadAllSupervisorUsers(departmentId) {
    this.usersService.getAllUsersByRoleNameAndDepartmentId(departmentId, "Supervisor").subscribe(
      res => {
        console.log(res);
        this.supervisors = res;
        if (this.supervisors != undefined) {
          this.supervisors.forEach(user => {
            this.supervisorMap[user.userId] = user.userName;
          });
          if(this.department != undefined)
          {
            this.f.supervisorId.setValue(this.department.supervisorId);
            this.f.supervisorName.setValue(this.department.supervisorName);
          }
        }
        this.showLoader = false;
      },
      err => {
        console.log("Error occured");
        this.showLoader = false;
        console.log(err);
        this.commonService.openSnackBar('User Load Failed : ' + err.error.message, 'badge-danger');
      }
    );

  }

  onSubmit() {
    this.submitted = true;

    if (this.departmentForm.invalid) {
      console.log('Mandatory fields missing');
      return;
    }

    this.f.supervisorName.setValue(this.supervisorMap[this.f.supervisorId.value]);

    if (this.currentPage == "edit") {
      this.updateDepartment();
    }
    else {
      this.saveDepartment();
    }
  }

  saveDepartment() {

    this.showLoader = true;
    this.departmentService.createDepartment(this.departmentForm.value).subscribe(
      res => {
        console.log(res);
        this.showLoader = false;
        this.commonService.openSnackBar("Department Created Successfully", 'badge-success');
        this.router.navigate(['index/departments']);
      },
      err => {
        this.showLoader = false;
        console.log("Error occured");
        console.log(err);
        this.commonService.openSnackBar('Department Creation Failed : ' + err.error.message, 'badge-danger');
      }
    );
  }

  updateDepartment() {

    this.showLoader = true;
    this.departmentService.updateDepartment(this.departmentForm.value).subscribe(
      res => {
        console.log(res);
        this.showLoader = false;
        this.commonService.openSnackBar("Department Updated Successfully", 'badge-success');
        this.router.navigate(['index/departments']);
      },
      err => {
        this.showLoader = false;
        console.log("Error occured");
        console.log(err);
        this.commonService.openSnackBar('Department Update Failed : ' + err.error.message, 'badge-danger');
      }
    );
  }

  openUserPopUp() {
    localStorage.setItem("selectedUsers", JSON.stringify(this.f.users.value));
    const dialogRef = this.dialog.open(UserDialogComponent, { disableClose: true , 
      data : {roleName:'User',departmentId:this.f.departmentId.value}});

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
      console.log(dialogRef.componentInstance.selectedUsers);
        this.f.users.setValue(dialogRef.componentInstance.selectedUsers);      
    });
  }

  reset() {
    CommonService.resetPage(this.router);
  }
  // convenience getter for easy access to form fields
  get f() { return this.departmentForm.controls; }

  removeUser(id) {
    for (let i = 0; i < this.f.users.value.length; i++) {
      if (this.f.users.value[i].userId == id) {
        this.f.users.value.splice(i, 1);
      }
    }
  }
}
