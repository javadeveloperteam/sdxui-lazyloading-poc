import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Helpers } from '../../../../../helpers/helpers';

@Injectable({
    providedIn: 'root'
})
export class ApplicationService {

    WMS_URL: string = Helpers.WMS_URL;

    constructor(private http: HttpClient) { }


    getAllApplication() {
        const httpOptions = { headers: Helpers.getTokenHeader() };
        return this.http.get(this.WMS_URL + 'applications', httpOptions);
    }

    createApplication(value: any) {
        const httpOptions = { headers: Helpers.getTokenHeader() };
        const body = JSON.stringify(value);
        return this.http.post(this.WMS_URL + 'applications', body, httpOptions);
    }



    updateApplication(value: any) {
        const httpOptions = { headers: Helpers.getTokenHeader() };
        const body = JSON.stringify(value);
        return this.http.put(this.WMS_URL + 'applications/'+value.applicationId, body, httpOptions);
    }

    getApplication(id:any) {
        const httpOptions = { headers: Helpers.getTokenHeader() };
        return this.http.get(this.WMS_URL + 'applications/'+id, httpOptions);
    }

    
    getApplicationDependents(id:any) {
        const httpOptions = { headers: Helpers.getTokenHeader() };
        return this.http.get(this.WMS_URL + 'applications/'+id+'/dependencies', httpOptions);
    }

    deleteApplication(id: Number) {
        const httpOptions = { headers: Helpers.getTokenHeader() };
        return this.http.delete(this.WMS_URL + 'applications/'+id, httpOptions);
    }

}
