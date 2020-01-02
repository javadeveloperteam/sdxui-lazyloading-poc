import { Component, OnInit } from '@angular/core';
import { DestinationService } from "../destination/services/destination.service";
import { UsersService } from "../users/services/users.service";
import { FormBuilder, FormGroup, Validators, EmailValidator } from "@angular/forms";
import { CommonService } from 'src/app/common/services/common.service';
import { ActivatedRoute, Router } from "@angular/router";
import { MatDialog } from '@angular/material';
import { UserDialogComponent } from '../dialog/user-dialog/user-dialog.component';
@Component({
  selector: 'app-destination',
  templateUrl: './destination.component.html',
  styleUrls: ['./destination.component.css']
})
export class DestinationComponent implements OnInit {

  showLoader: Boolean = false;
  submitted: Boolean = false;
  destinationForm: FormGroup;
  users: any;
  userMap = {};
  destination: any;
  currentPage: String = "add";
  buttonName: String = "Create";
  countries: any;
  user: any = {};

  constructor(
    private formBuilder: FormBuilder,
    private destinationService: DestinationService,
    private usersService: UsersService,
    private route: ActivatedRoute,
    private router: Router,
    private commonService: CommonService,
    private dialog: MatDialog) {
    this.route.params.subscribe(params => this.currentPage = params['page']);
  }


  ngOnInit() {

     // Page should load with loader
     this.showLoader = true;

    // Declare Form
    this.destinationForm = this.formBuilder.group({
      destinationId: [],
      destinationName: ['', Validators.required],
      active: ['true', Validators.required],
      type: ['Email', Validators.required],
      defaultDestination: [''],
      countryCode: ['',Validators.required],
      toMailId: [null,Validators.pattern('[a-zA-Z0-9.-_]{3,}@[a-zA-Z.-]{2,}[.]{1}[a-zA-Z]{2,}')],
      toNumber: [null,[Validators.required,Validators.maxLength(12),  
        Validators.pattern('^[0-9]*$')]],
      userId: ['', Validators.required],
      userName: ['', Validators.required],
      comments: [''],
      createdBy: [],
      createdByName: [],
      createdOn: []
    });

    // Patch Values if Edit
    console.log(this.currentPage);
    if (this.currentPage == "edit") {
      this.buttonName = "Update";
      let destinationId = localStorage.getItem("destinationId");
      if (destinationId != null) {
        this.getDestination(destinationId);
      }
      else {
        this.router.navigate(['index/destinations']);
      }
    }
    else {

      this.destination = {};
      //loadAllUsers
      //this.loadAllUsers();
      this.loadCountries();
      // Enable Fields based on Type
      this.resetValidators(this.f.type.value);
    }
  }

  getDestination(destinationId: any) {
    this.destinationService.getDestination(destinationId).subscribe(
      res => {
        console.log(res);
        this.destination = res;
        this.destinationForm.patchValue(this.destination);
        
        //this.loadAllUsers();
        this.loadCountries();        
        // Enable Fields based on Type
        this.resetValidators(this.f.type.value);
      },
      err => {
        console.log("Error occured");
        this.showLoader = false;
        console.log(err);
        this.commonService.openSnackBar('Contact Load Failed : ' + err.error.message, 'badge-danger');
      }
    );
  }

  loadCountries() {
    this.showLoader = true;
    this.usersService.getCountries().subscribe(
      res => {
        console.log(res);
        this.showLoader = false;

        this.countries = res;
        if (this.currentPage == "edit") {          
          if(this.destination.type == 'SMS'){
          let mob = this.destination.toNumber;
          let countryCode = JSON.stringify(this.destination.countryCode);
          this.destination.toNumber = mob.substring(countryCode.length, mob.length);
          this.destination.countryCode = this.destination.countryCode;
          }
          this.destinationForm.patchValue(this.destination);
        }
      },
      err => {
        console.log("Error occured");
        this.showLoader = false;
        console.log(err);
        this.commonService.openSnackBar('Country Load Failed : ' + err.error.message, 'badge-danger');
      }
    );
  }
  loadAllUsers() {
    this.showLoader = true;
    this.usersService.getAllUsers().subscribe(
      res => {
        console.log(res);
        this.users = res;
        this.users.forEach(user => {
          this.userMap[user.userId] = user;
        });
        if (this.currentPage == "edit") {
          this.f.userId.setValue(this.destination.userId);
        }
       /*  else if (this.users.length > 0) {
          this.f.userId.setValue();
        } */

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
    console.log(this.user);
    
    if (this.destinationForm.invalid) {
      console.log(this.destinationForm);
      console.log('Mandatory fields missing');
      return;
    }
    // Dont create/update if User is Not activated
    
      let temp = this.user.active;
      console.log(temp);
      if(temp != undefined && !temp)
      {
        this.commonService.openSnackBar('Cannot create Contact for Inactive User', 'badge-danger');
        return;
      }
    

    // Set Mobile Number
    if(this.f.type.value == 'SMS')
    {
      this.f.toMailId.setValue(null);
    this.f.toNumber.setValue(this.f.countryCode.value + this.f.toNumber.value);

    }
    else if(this.f.type.value == 'Email')
    {
      this.f.toNumber.setValue(null);
      this.f.countryCode.setValue(null);      
    }

    
    if (this.currentPage == "edit") {
      this.updateDestination();
    }
    else {
      this.saveDestination();
    }
  }
  saveDestination() {

    this.showLoader = true;

    this.destinationService.createDestination(this.destinationForm.value).subscribe(
      res => {
        console.log(res);
        this.showLoader = false;
        this.commonService.openSnackBar("Contact Created Successfully", 'badge-success');
        this.router.navigate(['index/destinations']);
      },
      err => {
        this.showLoader = false;
        console.log("Error occured");
        console.log(err);
        this.commonService.openSnackBar('Contact Creation Failed : ' + err.error.message, 'badge-danger');
      }
    );
  }

  updateDestination() {   
    this.showLoader = true;
    this.destinationService.updateDestination(this.destinationForm.value).subscribe(
      res => {
        console.log(res);
        this.showLoader = false;
        this.commonService.openSnackBar("Contact Updated Successfully", 'badge-success');
        this.router.navigate(['index/destinations']);
      },
      err => {
        this.showLoader = false;
        console.log("Error occured");
        console.log(err);
        this.commonService.openSnackBar('Contact Update Failed : ' + err.error.message, 'badge-danger');
      }
    );
  }

  resetValidators(type: String) {
    console.log(type);
    if (type == "Email") {
      this.f.toMailId.setValidators([Validators.required,Validators.pattern('[a-zA-Z0-9.-_]{3,}@[a-zA-Z.-]{2,}[.]{1}[a-zA-Z]{2,}')]);
      this.f.countryCode.setValidators([]);
      this.f.toNumber.setValidators([]);

    } else {
      this.f.toNumber.setValidators([Validators.required,Validators.maxLength(12),  
        Validators.pattern('^[0-9]*$')]);
      this.f.toMailId.setValidators([]);
      this.f.countryCode.setValidators([Validators.required]);
    }
    this.f.toNumber.updateValueAndValidity();
    this.f.toMailId.updateValueAndValidity();
    this.f.countryCode.updateValueAndValidity();
    
  }

  openUserPopUp(){
    localStorage.setItem('selectedUsers',JSON.stringify(new User(this.f.userId.value,this.f.userName.value)));
    // localStorage.setItem("selectedUsers", JSON.stringify(this.f.userId.value));
    const dialogRef = this.dialog.open(UserDialogComponent, { disableClose: true , data: {
      type: "singleselect"}});

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
      console.log(dialogRef.componentInstance.selectedUsers);
      if(dialogRef.componentInstance.selectedUsers.length >=1){
        this.user = dialogRef.componentInstance.selectedUsers[0];
        this.f.userId.setValue(this.user.userId);
        this.f.userName.setValue(this.user.userName);
      }else{
        this.user = {};
        this.f.userId.setValue('');
        this.f.userName.setValue('');
      }
    });
  }

  reset() {
    CommonService.resetPage(this.router);
  }
  // convenience getter for easy access to form fields
  get f() { return this.destinationForm.controls; }

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