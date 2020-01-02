import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Helpers } from '../../helpers/helpers';

@Injectable({
    providedIn: 'root'
})
export class URLConfigService {

    ADMIN_URL: string = Helpers.somAdminUrl;
    
    constructor(private http: HttpClient) { }


    getScreenConfigs(roleName:any) {
        const httpOptions = { headers: Helpers.getTokenHeader() };
        return this.http.get(this.ADMIN_URL + 'screenconfigs/'+roleName, httpOptions);
    }

}
