import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, EmailValidator, FormControl, AbstractControl, ValidatorFn } from "@angular/forms";
import { HttpClient } from '@angular/common/http';
import { Router } from "@angular/router";
import { UsersService } from "./services/users.service";
import { DepartmentService } from "../department/services/department.service";
import { ActivatedRoute } from "@angular/router";
import { CommonService } from 'src/app/common/services/common.service';
import { Helpers } from "src/app/helpers/helpers";
import { DestinationService } from '../destination/services/destination.service';
import { ScheduleService } from '../schedule/services/schedule.service';

@Component({
    selector: 'app-users',
    templateUrl: './users.component.html',
    styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {
    screenTitle: String = "USER";
    userRole :any;
    showLoader: boolean = false;
    countryList: any[];
    stateList: any[];
    cityList: any[];
    departmentList: any[];
    departmentMap: any;
    currentPage: string;
    countryCodeMap: any;
    zipCodeMap: any;
    users: any;
    userId: String;
    usersForm: FormGroup;
    submitted: boolean;
    destinations : any = [];
    schedules : any = [];
    //Disable profile page input attribute
    disableProfilePageTag: boolean;
    disableEditPageTag: boolean;
    profileImageURL: string;
    profileImage: string;
    profileImageFile: File[];
    profileSize: String;
    profileType: String; 


    constructor(
        private formBuilder: FormBuilder,
        private http: HttpClient,
        private router: Router,
        private userService: UsersService,
        private departmentService: DepartmentService,
        private scheduleService: ScheduleService,
        private route: ActivatedRoute,
        private destinationService : DestinationService,
        private commonService: CommonService
    ) {
        this.route.params.subscribe(params => this.currentPage = params['page']);
    }

    ngOnInit() {
        // Page load should start with loader
        this.showLoader = true;

        this.userRole = Helpers.getUserRole();
        console.info("page : " + this.currentPage);
        this.departmentList = [];
        this.countryList = [];
        this.stateList = [];
        this.cityList = [];
        this.submitted = false;
        this.disableProfilePageTag = false;
        this.disableEditPageTag = false;
        this.profileImageFile= [];
        this.usersForm = this.formBuilder.group({
            userName: ['', Validators.required],
            employeeId: ['', Validators.required],
            roleName: ['User', Validators.required],
            departmentId: [null],
            departmentName:[''],
            firstName: ['', Validators.required],
            lastName: [''],
            emailId: new FormControl('', Validators.compose([Validators.required,
            Validators.pattern('[a-zA-Z0-9.-_]{3,}@[a-zA-Z.-]{2,}[.]{1}[a-zA-Z]{2,}')])),
            countryCode: ['', Validators.required],
            mobileNo: ['', [Validators.required, Validators.pattern('[0-9]{10,10}')]],
            /* mobileNo :['', [Validators.required, Validators.minLength(10)]],  */
            addressLine1: ['', Validators.required],
            addressLine2: [''],
            city: ["", Validators.required],
            state: ["", Validators.required],
            country: ["", Validators.required],
            zipCode: ['', Validators.required],
            location: ['', Validators.required],
            active:['false'],
            comments: ['']
           // profile: new FormControl('',[imageTypeValidator(['png','jpg','jpeg'])])
        });

        this.usersForm.controls['countryCode'].disable();
        this.loadDepartments();
        switch (this.currentPage) {
            case 'add':
                this.screenTitle = "CREATE USER";
                this.loadCountries(false);
                break;
            case 'edit':
                this.screenTitle = "MANAGE USER";
                this.disableEditPageTag = true;
                let editUser = JSON.parse(localStorage.getItem("editUser"));
                console.log("editUser : " + editUser.userId);
                this.userId = editUser.userId;
                this.editUser();
                this.fetchDestinationByUser(this.userId);
                this.fetchScheduleByUser(this.userId);
                break;
            case 'userProfile':
                this.screenTitle = "MY PROFILE";
                this.disableProfilePageTag = true;
                const currentUser = JSON.parse(localStorage.getItem('currentUser'));
                console.log("currentUser : " + currentUser.userId);
                this.userId = currentUser.userId;
                this.editUser();
                this.fetchDestinationByUser(this.userId);
                this.fetchScheduleByUser(this.userId);
                break;
            default:
                    this.showLoader = false;
                break;
        }
    }

    get f() { return this.usersForm.controls; }

    editUser() {
        this.userService.getUser(this.userId).subscribe(
            res => {
                this.showLoader = false;
                this.users = res;
                this.loadCountries(true);
                //Data will patch before loading all countires due to service call
                this.usersForm.patchValue(this.users);
                this.profileImage = this.users['profileImage'];
                if(this.profileImage!=null){
                    this.profileImageURL = 'data:image/jpg;base64,' + this.users['profileImageBytes'];
                    console.log('profileImgURL' + this.profileImageURL);
                }
            },
            err => {
                this.showLoader = false;
                console.log("Error occured");
            }
        );
    }

    loadDepartments() {
        this.departmentService.getAllDepartment().subscribe(
            (response: Array<Object>) => {
                this.departmentMap = {};
                this.departmentList = response;
                this.departmentList.forEach(element => {
                    this.departmentMap[element['departmentId']] = element['departmentName'];
                });
            },
            err => {
                console.log("Error occured");
                this.commonService.openSnackBar('Department Loading Failed : ' + err.error.message, 'badge-danger');
                this.showLoader = false;
            });
    }

    onSubmit() {
        console.info("submit");
        console.info(this.f.mobileNo.errors);
        this.submitted = true;
        if (this.usersForm.invalid) {
            console.log(this.usersForm);
            //this.submitted = false;
            return;
        }

        if(this.profileSize == 'in-valid' || this.profileType == 'in-valid'){
            return;
        }

        // this.showLoader = true;

        const user = this.usersForm.value;
        if(this.f.departmentId.value != null)
        {
            user['departmentName'] = this.departmentMap[this.f.departmentId.value];
        }
        else
        {
            user['departmentName'] = '';    
        }  
        user['mobileNo'] = this.usersForm.controls['countryCode'].value + this.usersForm.controls['mobileNo'].value;
        user['userId'] = this.userId;
        user['profileImage'] = this.profileImage;
        let userName = user['userName'];
        const formData: FormData = new FormData();
        formData.append('user', JSON.stringify(user));
        this.profileImageFile.forEach(file=>{
            console.log(JSON.stringify(file));
            formData.append('attachments', file);
        });
        console.log("profileImage"+ this.profileImage);
    
        switch (this.currentPage) {
            case 'add':
                this.createUserServiceCall(formData);
                break;
            case 'edit':
                this.editUserServiceCall(formData,userName);
                break;
            case 'userProfile':
                this.editUserServiceCall(formData,userName);
                break;
            default:
                break;
        }
    }

    createUserServiceCall(formData:FormData) {
        this.showLoader = true
        console.log("createUserServiceCall formData::: " + formData);
        this.userService.createUser(formData).subscribe(
            res => {
                this.showLoader = false;
                console.log(res);
               
                 this.loadUserListPage();
                 this.commonService.openSnackBar("User created Successfully, User Activation link as been sent to the user Email ID" , 'badge-success');

            },
            err => {
                this.showLoader = false;
                this.commonService.openSnackBar('User Creation Failed : ' + err.error.message, 'badge-danger');
                console.error(err);
                console.log("Error occured");
            }
        );
    }

    editUserServiceCall(formData:FormData,name:string) {
        this.showLoader = true
        console.log("editUserServiceCall formData ::: " + formData);
        this.userService.updateUser(formData).subscribe(
            res => {
                this.showLoader = false;
                console.log(res);

                this.loadUserListPage();
               this.reloadProfileImage();
               this.commonService.openSnackBar('User - ' + name + ' Updated Successfully', 'badge-success');


            },
            err => {
                this.showLoader = false;
                console.error(err);
                this.commonService.openSnackBar('User Update Failed : ' + err.error.message, 'badge-danger');
            }
        );
    }
    back() {
        this.router.navigate(['index/users']);
    }
    loadUserListPage() {
        switch (this.currentPage) {
            case 'add':
                this.router.navigate(['index/users']);
                break;
            case 'edit':
                this.router.navigate(['index/users']);
                break;
            case 'userProfile':
                this.router.navigate(['index/users/userProfile']);
                break;
            default:
                this.router.navigate(['index/users']);
                break;
        }
    }


    loadCountries(editMode): any {
        this.userService.getCountries().subscribe(
            (result: Array<Object>) => {
                console.info(result);
                this.countryCodeMap = {};
                if (typeof result != undefined && result != null) {
                    result.forEach(obj => {
                        this.countryCodeMap[obj['country']] = obj['countryCode'];
                    });
                    this.countryList = result;
                }
                console.info(this.countryList);
                console.info(this.countryCodeMap);

                if (editMode) {
                    this.usersForm.get('country').setValue(this.users.country);
                    this.loadStates(this.users.country, editMode);
                }
                else
                {
                    this.showLoader = false;
                }

            },
            err => {
                this.showLoader = false;
                console.log("loading countries failed");
            }
        )
    }

    loadStates(country, editMode): any {
       // this.showLoader = true;
        if (country == "null") {
            this.usersForm.get('country').reset();
        }

        this.setCountryCode(country, editMode);
        this.userService.getStates(country).subscribe(
            (result: Array<Object>) => {

            //    this.showLoader = false;
                console.info(result);
                if (typeof result != undefined && result != null) {
                    this.stateList = result;
                }

                if (editMode) {
                    this.usersForm.get('state').setValue(this.users.state);
                    this.loadCities(country, this.users.state, editMode);
                } else {
                    this.cityList = [];
                    this.zipCodeMap = {};
                    this.usersForm.get('state').setValue('');
                    this.usersForm.get('city').setValue('');
                    this.usersForm.get('zipCode').setValue('');
                }

            },
            err => {
                this.showLoader = false;
                console.log("loading states failed");
            }
        )
    }

    loadCities(countryCode, stateCode, editMode): any {
        //this.showLoader = true;
        if (stateCode == "null") {
            this.usersForm.get('state').reset();
        }
        //let userForm = { "country": countryCode, "state": stateCode };
        this.userService.getCities(stateCode).subscribe(
            (result: Array<Object>) => {
            //    this.showLoader = false;
                console.info(result);
                this.zipCodeMap = {};
                if (typeof result != undefined && result != null) {
                    result.forEach(obj => {
                        this.zipCodeMap[obj['city']] = obj['zipCode'];
                    });
                    this.cityList = result;
                }

                if (editMode) {
                    this.usersForm.get('city').setValue(this.users.city);
                    this.setZipCode(this.users.city);
                } else {
                    this.usersForm.get('city').setValue('');
                    this.usersForm.get('zipCode').setValue('');
                }
            },
            err => {
                this.showLoader = false;
                console.log("loading cities failed");
            }
        )
    }

    setCountryCode(country, editMode) {
        this.usersForm.controls['countryCode'].setValue(this.countryCodeMap[country]);
        if (editMode) {
            let tempMobileNo = this.users['mobileNo'];
            let tempMobileNoLen = this.users['mobileNo'].length;
            let tempContryCodeLen = this.countryCodeMap[country].length;
            this.usersForm.controls['mobileNo'].setValue(tempMobileNo.substring(tempContryCodeLen, tempMobileNoLen));
        }
    }

    setZipCode(city) {
        if (typeof city != "undefined" && city != "" && city != null && city != "null") {
            this.usersForm.controls['zipCode'].setValue(this.zipCodeMap[city])
        }
        else {
            this.usersForm.controls['zipCode'].setValue("");
            this.usersForm.get('city').reset();
        }
    }
    cancel() {
        CommonService.resetPage(this.router);
        //this.loadUserListPage();
        //this.usersForm.reset();
        //this.ngOnInit();
    }

    processProfile(event){
      this.profileImageFile = [];
      this.profileImage = null;
      this.profileImageURL = null;
      let file = event.target.files[0];
      let valid = this.profileValidator(file);
      if(valid){
        this.profileImageFile.push(file);
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.addEventListener('load',(event:any)=>{
            this.profileImageURL = event.target.result;
        });
      }
    }

    profileValidator(file: File): boolean{
        let isValid = false;
        var name = file.name;
        var type = file.type;
        var size = file.size;
        this.profileSize ='';
        this.profileType ='';
        
        if((size/1024)>100){
          this.profileSize = 'in-valid';
        }

        const acceptedImageTypes = ['jpg', 'jpeg', 'png'];
        const isImage = type.split('/')[0] === 'image';
        const fileExtension = name.split('.').pop();

        if(!isImage || !acceptedImageTypes.includes(fileExtension)){
            this.profileType = 'in-valid';
        };
      
        if(this.profileSize !='in-valid' && this.profileType !='in-valid'){
            isValid = true;
        }
        return isValid;
    }


    deleteProfilePic(){
        this.profileImageFile = [];
        this.profileImage = null;
        this.profileImageURL = null;
    }

    reloadProfileImage(){
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        let currentUserId = currentUser.userId;
        if(this.currentPage =='userProfile' || this.userId === currentUserId){
            CommonService.resetWholePage(this.router);
        }
    }
    
    fetchDestinationByUser(userId:any) {
        this.showLoader = true;
        this.destinationService.getDestinationList(userId).subscribe(
            res => {
                this.showLoader = false;
                this.destinations = res;
            },
            err => {
                this.showLoader = false;
                console.error(err);
                console.log("Error occured");
            }
        );
    }

    fetchScheduleByUser(userId:any) {
        this.showLoader = true;
        this.scheduleService.getAllScheduleByUser(userId).subscribe(
            res => {
                this.showLoader = false;
                this.schedules = res;
            },
            err => {
                this.showLoader = false;
                console.error(err);
                console.log("Error occured");
            }
        );
    }
}

function imageTypeValidator(fileTypes: String[]): ValidatorFn{
    return (control: AbstractControl) : { [key: string]: boolean } | null =>{
        if (typeof control.value != undefined && control.value != null) {
            const file = control.value;
            if(file){
               const extension = file.name.split('.')[1].toLowerCase();
               fileTypes.forEach(function (value){
                if (value.toLowerCase() !== extension.toLowerCase() ) {
                    return {'imageType': true };
                }
               });
            }
        }
        return null;
    }

}