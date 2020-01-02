import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Helpers } from '../../../../helpers/helpers';

@Injectable({
    providedIn: 'root'
})
export class ConfigurationService {
    senderURL: string = Helpers.somSenderUrl;

    constructor(private http: HttpClient) { }

    createConfiguration(value: any) {
        const httpOptions = { headers: Helpers.getTokenHeader() };
        return this.http.post(this.senderURL + "configurations", value, httpOptions);
    }

    updateConfiguration(value: any) {
        const httpOptions = { headers: Helpers.getTokenHeader() };
        return this.http.put(this.senderURL + 'configurations/'+value.configurationId, value, httpOptions);
    }

    getConfiguration(value: any) {
        const httpOptions = { headers: Helpers.getTokenHeader() };
        return this.http.get(this.senderURL + 'configurations/' + value, httpOptions);
    }

    deleteConfiguration(value: any) {
        const httpOptions = { headers: Helpers.getTokenHeader() };
        return this.http.delete(this.senderURL + 'configurations/' + value, httpOptions);
    }

    testConfiguration(value: any) {
        const httpOptions = { headers: Helpers.getTokenHeader() };
        return this.http.post(this.senderURL + 'configurations/test', JSON.stringify(value), httpOptions);
    }
    getAllConfigurations() {
        const httpOptions = { headers: Helpers.getTokenHeader() };
        return this.http.get(this.senderURL + 'configurations', httpOptions);
    }


    private jwt() {
        // create authorization header with jwt token
        let currentUser = JSON.parse(localStorage.getItem('currentUser'));
        if (currentUser && currentUser.token) {
            console.log(currentUser.access_token);
            let headerObj = new HttpHeaders()
                .set('Content-Type', 'application/json')
                .set('Authorization', 'Bearer ' + currentUser.token);
            const httpOptions = { headers: headerObj };
            return httpOptions;
        }
    }
}
