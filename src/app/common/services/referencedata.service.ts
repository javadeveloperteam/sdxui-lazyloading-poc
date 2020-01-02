import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Helpers } from '../../helpers/helpers';

@Injectable({
    providedIn: 'root'
})
export class ReferenceDataService {

    WMS_URL: string = Helpers.WMS_URL;
    constructor(private http: HttpClient) { }


    getReferenceData(fieldName:any) {
        const httpOptions = { headers: Helpers.getTokenHeader() };
        return this.http.get(this.WMS_URL + 'references/'+fieldName, httpOptions);
    }

    createReferenceData(value: any) {
        const httpOptions = { headers: Helpers.getTokenHeader() };
        const body = JSON.stringify(value);
        return this.http.post(this.WMS_URL + 'references', body, httpOptions);
    }

}
