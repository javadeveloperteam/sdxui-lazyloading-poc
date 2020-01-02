import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Helpers } from '../../../../../helpers/helpers';

@Injectable({
    providedIn: 'root'
})
export class RuleService {

    WMS_URL: string = Helpers.WMS_URL;

    constructor(private http: HttpClient) { }


    getAllRules() {
        const httpOptions = { headers: Helpers.getTokenHeader() };
        return this.http.get(this.WMS_URL + 'rules', httpOptions);
    }

    createRule(value: any) {
        const httpOptions = { headers: Helpers.getTokenHeader() };
        const body = JSON.stringify(value);
        return this.http.post(this.WMS_URL + 'rules', body, httpOptions);
    }



    updateRule(value: any) {
        const httpOptions = { headers: Helpers.getTokenHeader() };
        const body = JSON.stringify(value);
        return this.http.put(this.WMS_URL + 'rules/'+value.ruleId, body, httpOptions);
    }

    getRule(id:any) {
        const httpOptions = { headers: Helpers.getTokenHeader() };
        return this.http.get(this.WMS_URL + 'rules/'+id, httpOptions);
    }

    getRuleDependents(id:any,eventId:any) {
        const httpOptions = { headers: Helpers.getTokenHeader() };
        return this.http.get(this.WMS_URL + 'rules/'+id+'/dependencies?event_id='+eventId, httpOptions);
    }
    
    deleteRule(id: Number) {
        const httpOptions = { headers: Helpers.getTokenHeader() };
        return this.http.delete(this.WMS_URL + 'rules/'+id, httpOptions);
    }

    getRuleByEvent(eventId : any) {
        const httpOptions = { headers: Helpers.getTokenHeader() };
        return this.http.get(this.WMS_URL + 'rules?event_id='+eventId, httpOptions);
    }

}
