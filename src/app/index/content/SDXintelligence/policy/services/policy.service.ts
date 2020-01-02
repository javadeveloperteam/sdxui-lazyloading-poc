import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Helpers } from '../../../../../helpers/helpers';

@Injectable({
    providedIn: 'root'
})
export class PolicyService {

    WMS_URL: string = Helpers.WMS_URL;

    constructor(private http: HttpClient) { }


    getAllPolicies() {
        const httpOptions = { headers: Helpers.getTokenHeader() };
        return this.http.get(this.WMS_URL + 'policies', httpOptions);
    }

    createPolicy(value: any) {
        const httpOptions = { headers: Helpers.getTokenHeader() };
        const body = JSON.stringify(value);
        return this.http.post(this.WMS_URL + 'policies', body, httpOptions);
    }



    updatePolicy(value: any) {
        const httpOptions = { headers: Helpers.getTokenHeader() };
        const body = JSON.stringify(value);
        return this.http.put(this.WMS_URL + 'policies/'+value.policyId, body, httpOptions);
    }

    getPolicy(id:any) {
        const httpOptions = { headers: Helpers.getTokenHeader() };
        return this.http.get(this.WMS_URL + 'policies/'+id, httpOptions);
    }

    deletePolicy(id: Number) {
        const httpOptions = { headers: Helpers.getTokenHeader() };
        return this.http.delete(this.WMS_URL + 'policies/'+id, httpOptions);
    }
}
