import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpResponse } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Helpers } from 'src/app/helpers/helpers';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {

    baseurl: string = Helpers.somOauthUrl;

    headerObj: HttpHeaders;
    baseUserName = 'SOMApplication';
    basePassword = 'SOMSecret';
    grantType = 'password';

    constructor(private http: HttpClient) {
        this.headerObj = new HttpHeaders()
            .set('Content-Type', 'application/x-www-form-urlencoded')
            .set('Authorization', 'Basic ' + btoa(this.baseUserName + ':' + this.basePassword));
    }

    getAuthHeaders() {
        return this.headerObj;
    }

    login(email: string, password: string) {
        const httpOptions = {
            headers: this.getAuthHeaders()
        };
        const body = new HttpParams()
            .set('username', email)
            .set('password', password)
            .set('grant_type', this.grantType);
        return this.http.post(this.baseurl + 'oauth/token',
            body,
            httpOptions
        )
            .pipe(map((response: any) => {
                const user = response;
                if (user && user.access_token) {
                    // store user details and jwt token in local storage to keep user logged in between page refreshes
                    localStorage.setItem('currentUser', JSON.stringify(user));
                    if(user.userRole)
                    {
                        localStorage.setItem('userRole',user.userRole);
                    }
                    
                }
            }
            ));
    }

    logout() {
        // remove user from local storage to log user out
        localStorage.removeItem('currentUser');
        localStorage.removeItem('userdetails');
        Helpers.clearChangePasswordToken();
    }
}
