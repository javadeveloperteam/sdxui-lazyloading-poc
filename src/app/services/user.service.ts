import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders,HttpResponse } from '@angular/common/http';
import {  } from '@angular/common/http';
import { Helpers } from '../helpers/helpers';
import { User } from '../model/user';


@Injectable({
  providedIn: 'root',
})
export class UserService {

    adminURL = Helpers.somAdminUrl;
    constructor(private http: HttpClient) {
    }

    verify() {
      return this.http.get(this.adminURL + 'validateUser/' + this.getJWTToken(),
       this.jwt()  );
    }

    forgotPassword(email: string) {
        return this.http.post(this.adminURL + 'users/forgotPassword/' + email,
            {});
            //.map((response: Response) => response.json());
    }

    generateOtp(tokenURL: string) {
      let headerObj = this.getNoAuthHeader().headers;
        return this.http.post(this.adminURL + 'users/generateOTP',
            JSON.stringify({ tokenUrl: tokenURL }), { headers : headerObj, responseType : 'text'}  );
    }


    resetPassword(token: string, rpassword: string, otpString: string, otpId: string) {
        return this.http.post(this.adminURL + 'users/setPassword',
            JSON.stringify({
                tokenUrl: token,
                newPassword: rpassword,
                otpValue: otpString,
                otpId : otpId
              }), this.getNoAuthHeader());
    }

    changePassword(token: string, password: string) {
        return this.http.post(this.adminURL + 'users/changePassword',
            JSON.stringify({
               tokenUrl: token,
               newPassword: password
            }), this.getNoAuthHeader());
    }

    // private helper methods

    private jwt() {
        // create authorization header with jwt token
        const currentUser = Helpers.getCurrentUser();
        if (currentUser && currentUser.access_token) {
            const headerObj = new HttpHeaders()
            .set('Authorization' , 'Bearer ' + currentUser.access_token ) ;
            return { headers: headerObj};
        }
    }

    private getJWTToken() {
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        if (currentUser && currentUser.access_token) {
            return currentUser.access_token;
        }
        return 'dummy';
    }

    private getNoAuthHeader() {
      const headerObj = new HttpHeaders()
      .set('Content-Type', 'application/json');
      return { headers: headerObj};
    }

    private getNoAuthPlainHeader() {
        const headerObj = new HttpHeaders()
      .set('Content-Type', 'text/plain');
        return { headers: headerObj};
    }
}
