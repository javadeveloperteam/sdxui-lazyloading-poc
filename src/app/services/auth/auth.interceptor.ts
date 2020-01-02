import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Injectable, forwardRef, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Helpers } from 'src/app/helpers/helpers';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationInterceptor implements HttpInterceptor{

  constructor(@Inject(forwardRef(() => Router)) private router: Router) {

  }
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    // Allow auth less calls - OTP, forget Password
    let headers = request.headers;
    if(headers != null && headers.get('Authorization') == null)
    {
      return next.handle(request);
    }  

    //request
    let lastAPITime = localStorage.getItem('lastAPITime');
    if(lastAPITime != null && lastAPITime != undefined)
    {
        let lastTime = new Date(lastAPITime).getTime();
        let currentTime = new Date().getTime();
        if(Math.abs(currentTime - lastTime) > 3600000)
        {        
          Helpers.logout();
          Helpers.redirectToLoginPageWithErrorMessage(this.router, 'Session Expired');     
        }
    } 

    localStorage.setItem('lastAPITime',new Date().toUTCString());
    return next.handle(request).pipe( tap(() => {},
      (err: any) => {
      if (err instanceof HttpErrorResponse) {
        if (err.status !== 401) {
         return;
        }
        Helpers.logout();
        Helpers.redirectToLoginPageWithErrorMessage(this.router, 'Session Timeout / Token Expired. Login again');
      }
    }));
  }

}
