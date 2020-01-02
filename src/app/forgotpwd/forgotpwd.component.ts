import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../services/auth/authentication.service';
import { Router } from '@angular/router';
import { User } from '../model/user';
import { first } from 'rxjs/operators';
import { UserService } from '../services/user.service';
import { AlertMessageComponent } from '../common/alert.message.component';
import { Helpers } from '../helpers/helpers';

@Component({
  selector: 'app-forgotpwd',
  templateUrl: './forgotpwd.component.html',
  styleUrls: ['./forgotpwd.component.css']
})
export class ForgotpwdComponent extends AlertMessageComponent implements OnInit {

  model: User;
  loading: boolean;

  constructor(private router: Router, private userService: UserService) {
    super();
  }

  ngOnInit() {
    this.model = new User();
  }

  triggerForgotPassword() {
    this.loading = true;
    this.userService.forgotPassword(this.model.email).
    pipe(first())
    .subscribe(
      data => {
        this.loading = false;
        this.showSuccessMessage(
            'Password recovery instruction has been sent to your email.'
            );
        Helpers.redirectToLoginPageWithMessage(this.router,
        'Password recovery instruction has been sent to your email.', 'success');

    },
    error => {
        this.loading = false;
        this.showFailureMessage('Invalid email ID');
    }


    );
  }

}
