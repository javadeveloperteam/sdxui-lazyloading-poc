import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../services/auth/authentication.service';
import { Router, ActivatedRoute } from '@angular/router';
import { User } from '../model/user';
import { first } from 'rxjs/operators';
import { UserService } from '../services/user.service';
import { Helpers } from '../helpers/helpers';
import { AlertMessageComponent } from '../common/alert.message.component';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';

@Component({
  selector: 'app-resetpwd',
  templateUrl: './resetpwd.component.html',
  styleUrls: ['./resetpwd.component.css']
})
export class ResetpwdComponent extends AlertMessageComponent implements OnInit {

  model: User;
  tokenUrl: any;
  paramSub: any;
  passwordToken: string;
  activateUser: boolean;
  loading: boolean;
  pageTitle: string;
  buttonName: string;
  resetPasswordForm: FormGroup;
  submitted: boolean;

  constructor(private authService: AuthenticationService, private router: Router,
              private userService: UserService, private activatedRoute: ActivatedRoute,
              private formBuilder: FormBuilder) {
                super();
  }

  ngOnInit() {
    this.model = new User();

    this.submitted = false;
    Helpers.logout();
    this.paramSub = this.activatedRoute.params.subscribe(params => this.tokenUrl = params.tokenUrl);
    this.passwordToken = decodeURIComponent(this.tokenUrl);
    this.activateUser = this.activatedRoute.snapshot.data.activateUser;
    if (this.activateUser) {
      this.pageTitle = 'Activate User';
      this.buttonName = 'Activate Password';
      this.resetPasswordForm = this.formBuilder.group({
        password: ['', Validators.compose([
          Validators.required,
          Validators.pattern('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&].{5,}')
         ])],
        confirmPassword: ['', Validators.required],
        passwordNotMatch: [''],
        otpSuffix: ['', Validators.required],
        otpPrefix: ['']
    }, {validator: this.validatePassword});
    } else {
      this.pageTitle = 'Reset Password';
      this.buttonName = 'Reset Password';
      this.resetPasswordForm = this.formBuilder.group({
        password: ['', Validators.compose([
          Validators.required,
          Validators.pattern('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&].{8,}')
         ])],
        confirmPassword: ['', Validators.required],
        passwordNotMatch: [''],
        otpSuffix: [''],
        otpPrefix: ['']
    }, {validator: this.validatePassword});
    }
  }


validatePassword(group: FormGroup) {
  let pass = group.get('password').value;
  let confirmPass = group.get('confirmPassword').value;
  /*if( pass === confirmPass) {
    group.controls.passwordNotMatch.reset();
  } else {
    group.controls.passwordNotMatch.setErrors({ passwordNotMatch: true });
  }*/
  return pass === confirmPass ? null : { passwordNotMatch: true };
}

get f() { return this.resetPasswordForm.controls; }

  resetPassword() {
    this.submitted = true;
    if (this.resetPasswordForm.invalid) {
          console.log(this.resetPasswordForm);
          return;
      }
    this.loading = true;
    this.model = this.resetPasswordForm.value;
    if (this.activateUser){
    this.userService.resetPassword(this.passwordToken, this.model.password,
        this.model.otpSuffix, this.model.otpPrefix).subscribe(
        (data: string) => {

            this.loading = false;
            Helpers.clearTokens();
            Helpers.redirectToLoginPageWithSuccessMessage(this.router,
              'Password Activated successfully'); //SC-61 defect fix
                //'Your password has been reset. Kindly login again!');
        },
        error => {
          this.loading = false;
          this.showFailureMessage('Password activation failed! - '+ error.error.message);
        });
      } else {
        this.userService.changePassword(this.passwordToken, this.model.password).subscribe(
          (data: string) => {
              this.loading = false;
              Helpers.clearTokens();
              Helpers.redirectToLoginPageWithSuccessMessage(this.router,
                'Your password has been reset. Kindly login again!');
          },
          error => {
            this.loading = false;
            Helpers.clearTokens();
            Helpers.redirectToLoginPageWithErrorMessage(this.router, error);
          });
      }

  }

  generateOtp() {
        this.loading = true;
        this.userService.generateOtp(this.passwordToken).
        pipe(first()).
        subscribe(
            data => {
              this.loading = false;
              this.resetPasswordForm.get('otpPrefix').setValue(data);
              this.model.otpPrefix = data;
                          },
            error => {
              this.loading = false;
              this.showFailureMessage('OTP Generation Failed!');
            });
  }

}
