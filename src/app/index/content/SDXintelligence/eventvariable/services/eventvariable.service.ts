import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Helpers } from '../../../../../helpers/helpers';

@Injectable({
    providedIn: 'root'
})
export class EventVariableService {

    WMS_URL: string = Helpers.WMS_URL;

    constructor(private http: HttpClient) { }


    getAllVariables() {
        const httpOptions = { headers: Helpers.getTokenHeader() };
        return this.http.get(this.WMS_URL + 'variables', httpOptions);
    }

    getAllVariableByEvent(eventId: any) {
        const httpOptions = { headers: Helpers.getTokenHeader() };
        return this.http.get(this.WMS_URL + 'events/' + eventId + '/variables', httpOptions);
    }

    createEventVariable(value: any) {
        const httpOptions = { headers: Helpers.getTokenHeader() };
        const body = JSON.stringify(value);
        return this.http.post(this.WMS_URL + 'events/' + value.eventId + '/variables', body, httpOptions);
    }

    updateEventVariable(value: any) {
        const httpOptions = { headers: Helpers.getTokenHeader() };
        const body = JSON.stringify(value);
        return this.http.put(this.WMS_URL + 'events/' + value.eventId + '/variables/' + value.variableId, body, httpOptions);
    }

    getEventVariable(eventId: any, variableId: any) {
        const httpOptions = { headers: Helpers.getTokenHeader() };
        return this.http.get(this.WMS_URL + 'events/' + eventId + '/variables/' + variableId, httpOptions);
    }

    deleteEventVariable(eventId: Number, variableId: Number) {
        const httpOptions = { headers: Helpers.getTokenHeader() };
        return this.http.delete(this.WMS_URL + 'events/' + eventId + '/variables/' + variableId, httpOptions);
    }

}
