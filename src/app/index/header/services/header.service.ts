import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Helpers } from './../../../helpers/helpers';

@Injectable({
    providedIn: 'root'
  })
  
export class headerService {

    adminURL = Helpers.somAdminUrl;

    constructor(private http: HttpClient) { }

    getUserProfileImage(value:any){
        const httpOptions = {  headers: Helpers.getTokenHeader() };
        return this.http.get(this.adminURL + 'users/' + value, httpOptions);
    }
}
