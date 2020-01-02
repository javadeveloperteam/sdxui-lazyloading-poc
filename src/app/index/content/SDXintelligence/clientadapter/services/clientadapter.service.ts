import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Helpers } from '../../../../../helpers/helpers';

@Injectable({
    providedIn: 'root'
})
export class ClientAdapterService {

    WMS_URL: string = Helpers.WMS_URL;

    constructor(private http: HttpClient) { }


    executeEvent(value: any) {
        const httpOptions = { headers: Helpers.getTokenHeader() };
        const body = JSON.stringify(value);
        return this.http.post(this.WMS_URL + 'events/execute', body, httpOptions);
    }

}
