import { Component, OnInit, ComponentFactoryResolver, ViewChild, ViewContainerRef } from '@angular/core';
import { AuthenticationService } from '../services/auth/authentication.service';
import { first, filter, map } from 'rxjs/operators';
import { Router, ActivatedRoute, NavigationStart } from '@angular/router';
import { AlertMessageComponent } from '../common/alert.message.component';
import { URLConfigService } from "../common/services/urlconfig.service";
import { FormBuilder, Validators, FormGroup} from "@angular/forms";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent extends AlertMessageComponent implements OnInit {

  loading: boolean;
  configs : any =[];
  loginForm : FormGroup;
  submitted : boolean;

  constructor(private authService: AuthenticationService, private router: Router,
    private formBuilder: FormBuilder,
     private activatedRoute: ActivatedRoute,
     private urlConfigService : URLConfigService) {
    super();
  }

  ngOnInit() {

      // Declare Form
      this.loginForm = this.formBuilder.group({
        userName:  ['', Validators.required],
        password: ['', Validators.required],
        id:  [],
        email: [],
        fullName: [],
        confirmPassword: [],
        otpPrefix: [],
        otpSuffix: [],
        otp: []
      });

    let msgFromNavigationState: any;
    this.activatedRoute.paramMap
    .pipe(map(() => window.history.state)).subscribe(data => { msgFromNavigationState = data.messageContent; } );
    if (msgFromNavigationState != null) {
      this.showMessage(msgFromNavigationState.message, msgFromNavigationState.messageType);
      }
    if (this.activatedRoute.snapshot.data.message != null){
        this.showMessage(this.activatedRoute.snapshot.data.message, this.activatedRoute.snapshot.data.messageType);
        }
  }

  onSubmit() {
    this.submitted = true;
    if(this.loginForm.invalid)
    {
      return;
    }
    this.loading = true;
    this.authService.login(this.f.userName.value, this.f.password.value).pipe(first())
    .subscribe( data => {
      let userRole = localStorage.getItem('userRole');

      localStorage.setItem('lastAPITime',new Date().toUTCString());

      if(userRole != null && userRole != undefined && userRole == 'User')
      {
        this.getScreenConfigs(userRole);
      }
      else{
        this.router.navigate(['/index']);
      }
  },
  error => {
    this.loading = false;
    console.log(error);
    if(error.error != undefined && error.error.error_description != undefined)
    {
      let errorMsg = error.error.error_description;
      if(errorMsg == 'Bad credentials')
      {
        this.showFailureMessage("Invalid Username/Password");
      }
      else
      {
        this.showFailureMessage(error.error.error_description);
      }
    }   
  });
  }



  getScreenConfigs(roleName:any)
  {
      this.loading = true;
      let urls = [];
      let menus = [];
      this.urlConfigService.getScreenConfigs(roleName).subscribe(
          res => {
              this.loading = false;
              console.log(res);
              this.configs = res;
              for(let i = 0 ; i < this.configs.length ; i++)
              {
               if(this.configs[i].configName == 'URL_CONFIG')
               {
                  urls.push(this.configs[i].configValue);
               }
               else
               if(this.configs[i].configName == 'MENU_CONFIG')
               {
                  menus.push(this.configs[i].configValue);
               }
              }
              localStorage.setItem('urlList',JSON.stringify(urls));
              localStorage.setItem('menuList',JSON.stringify(menus));
              this.router.navigate(['/index']);
              console.log(localStorage.getItem('urlList'));
              console.log(localStorage.getItem('menuList'));
          },
          err => {
              this.loading = false;
              console.log("Error occured");
          }
      );
  }
    // convenience getter for easy access to form fields
    get f() { return this.loginForm.controls; }

}
