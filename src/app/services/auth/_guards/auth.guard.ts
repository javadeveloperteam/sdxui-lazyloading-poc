import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { UserService } from '../../user.service';
import { Helpers } from 'src/app/helpers/helpers';


@Injectable({
    providedIn: 'root',
})
export class AuthGuard implements CanActivate {

    // tslint:disable-next-line:variable-name
    constructor(private _router: Router, private _userService: UserService) {
    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | boolean {
        // tslint:disable-next-line: prefer-const
        let currentUser = Helpers.getCurrentUser();
        console.log(currentUser);
        if (currentUser !== null) {
            let userRole = currentUser.userRole;
            console.log(state.url);
            if (state.url != '/index/dashboard' && userRole != null && userRole == 'User') {
                let match = this.matchRoleURL(state.url);
                if (match) {
                    return true;
                }
                else {
                    this._router.navigate(['index/unauthorized']);
                    return false;
                }
            }
            return true;
        }
        this._router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
        return false;
    }

    matchRoleURL(url: any) {
        if(localStorage.getItem('urlList') == null)
        {
            return true;
        }
        let urlList = JSON.parse(localStorage.getItem('urlList'));
        console.log(urlList);
        if (urlList != undefined) {
           for(let i = 0 ; i < urlList.length; i++) {
                if (urlList[i] == url) {
                    return true;
                }
            }
        }
        return false;
    }
}
