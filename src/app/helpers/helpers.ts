import { environment } from 'src/environments/environment';
import { HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';


export class Helpers {
    static somAdminUrl: string = environment.somAdminUrl;

    static somSenderUrl: string = environment.somSenderUrl;

    static somOauthUrl: string = environment.somOauthUrl;

    static WMS_URL: string = environment.WMS_URL;

    static forgotPasswordToken: string;
    static changePasswordToken: string;
    static passwordChangedToken: string;
    static passwordLinkExpiredToken: string;
    static passwordMessages = {
        'password.reset.mail.sent.successfully': 'Password recovery instruction has been sent to your email.',
        'password.invalid.otp': 'Invalid OTP',
        'password.strength.failure': 'Password should contain one upper case, one lower case, one digit, one special character',
        'password.cannot.be.same.as.old.password': 'Password cannot be same as old password'
    };

    static setForgotPasswordToken(token: string) {
        this.forgotPasswordToken = token;
    }

    static setChangePasswordToken(token: string) {
        this.changePasswordToken = token;
    }

    static setPasswordChangedToken(token: string) {
        this.passwordChangedToken = token;
    }

    static setPasswordLinkExpiredToken(token: string) {
        this.passwordLinkExpiredToken = token;
    }

    static clearForgotPasswordToken() {
        this.forgotPasswordToken = null;
    }
    static isResetPasswordEnable(): boolean {
        return this.forgotPasswordToken != null;
    }
    static getForgotPasswordToken(): string {
        return this.forgotPasswordToken;
    }

    static isChangePasswordEnable(): boolean {
        return this.changePasswordToken != null;
    }

    static getChangePasswordToken(): string {
        return this.changePasswordToken;
    }

    static getPasswordChangedToken(): string {
        return this.passwordChangedToken;
    }


    static getPasswordLinkExpiredToken(): string {
        return this.passwordLinkExpiredToken;
    }

    static isPasswordChangedEnable(): boolean {
        return this.passwordChangedToken != null;
    }

    static isPasswordLinkExpired(): boolean {
        return this.passwordLinkExpiredToken != null;
    }

    static clearChangePasswordToken() {
        this.changePasswordToken = null;
    }

    static clearPasswordChangedToken() {
        this.passwordChangedToken = null;
    }


    static clearPasswordLinkExpiredToken() {
        this.passwordLinkExpiredToken = null;
    }

    static getPasswordMessages(msgKey: string, status: string) {


        return Helpers.passwordMessages[msgKey];
    }

    static getTimeZone() {
        return Intl.DateTimeFormat().resolvedOptions().timeZone;
    }
    static clearTokens() {
        this.clearPasswordChangedToken();
        this.clearChangePasswordToken();
        this.clearForgotPasswordToken();
        this.clearPasswordLinkExpiredToken();
    }

    static getCurrentUser() {
        return JSON.parse(localStorage.getItem('currentUser'));
    }

    static getUserRole() {
        let user = JSON.parse(localStorage.getItem('currentUser'));
        if( user != null && user.userRole != null && user.userRole != undefined)
        {
            return user.userRole;
        }
        return null;
    }

    static getTokenHeader() {
        let currentUser = JSON.parse(localStorage.getItem('currentUser'));
        if(currentUser != null){
        console.log(currentUser.access_token);
        console.log("User id : "+currentUser.userId);
        console.log("User Name : "+currentUser.userFullName);
        const tempToken = currentUser.access_token;
        const userId = JSON.stringify(currentUser.userId);
        const userName = currentUser.userFullName;
        const headerObj = new HttpHeaders()
            .set('Content-Type', 'application/json')
            .set("Authorization", "Bearer " + tempToken)
            //.set("userid", "100").set("username", "Niraj");
            .set("userid",userId).set("username",userName);

        return headerObj;
        }
        else
        {
           return new HttpHeaders();
        }
    }

    static getTokenHeaderForFormData() {
        let currentUser = JSON.parse(localStorage.getItem('currentUser'));
        console.log(currentUser.access_token);
        console.log("User id : "+currentUser.userId);
        console.log("User Name : "+currentUser.userFullName);
        const tempToken = currentUser.access_token;
        const userId = JSON.stringify(currentUser.userId);
        const userName = currentUser.userFullName;
        const headerObj = new HttpHeaders()
            .set("Authorization", "Bearer " + tempToken)
            //.set("userid", "100").set("username", "Niraj");
            .set("userid",userId).set("username",userName);

        return headerObj;
    }

    static getNewTokenHeader() {
        let currentUser = JSON.parse(localStorage.getItem('currentUser'));
        console.log(currentUser.access_token);
        const tempToken = currentUser.access_token;
        const headerObj = new HttpHeaders()
            .set("Authorization", "Bearer " + tempToken)
            .set("userid", "1000")
            .set("username", "SuperAdmin");
        //.set("userid",userId).set("username",userName);
        return headerObj;
    }

    static setLoading(enable) {
        let body = $('body');
        if (enable) {
            $(body).addClass('m-page--loading-non-block');
        } else {
            $(body).removeClass('m-page--loading-non-block');
        }
    }

    static logout() {
        localStorage.removeItem('currentUser');
        localStorage.removeItem('userdetails');
        Helpers.clearChangePasswordToken();
    }

    static redirectToLoginPageWithMessage(router: Router, message: string, messageType: string) {
        router.navigate(['/login'], {
            state: {
                messageContent:
                    { message: message, messageType: messageType }
            }
        });
    }

    static redirectToLoginPageWithSuccessMessage(router: Router, message: string) {
        Helpers.redirectToLoginPageWithMessage(router, message, 'success');
    }

    static redirectToLoginPageWithErrorMessage(router: Router, message: string) {
        Helpers.redirectToLoginPageWithMessage(router, message, 'danger');
    }
}
