import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Helpers } from '../../../../../helpers/helpers';

@Injectable({
    providedIn: 'root'
})
export class EventService {

    WMS_URL: string = Helpers.WMS_URL;

    constructor(private http: HttpClient) { }

    getAllEvents() {
        const httpOptions = { headers: Helpers.getTokenHeader() };
        return this.http.get(this.WMS_URL + 'events', httpOptions);
    }

    getAllEventsByApplication(applicationId: any) {
        const httpOptions = { headers: Helpers.getTokenHeader() };
        return this.http.get(this.WMS_URL + 'applications/' + applicationId + '/events', httpOptions);
    }

    createEvent(value: any) {
        const httpOptions = { headers: Helpers.getTokenHeader() };
        const body = JSON.stringify(value);
        return this.http.post(this.WMS_URL + 'applications/' + value.applicationId + '/events', body, httpOptions);
    }

    updateEvent(value: any) {
        const httpOptions = { headers: Helpers.getTokenHeader() };
        const body = JSON.stringify(value);
        return this.http.put(this.WMS_URL + 'applications/' + value.applicationId + '/events/' + value.eventId, body, httpOptions);
    }

    getEvent(applicationId: any, eventId: any) {
        const httpOptions = { headers: Helpers.getTokenHeader() };
        return this.http.get(this.WMS_URL + 'applications/' + applicationId + '/events/' + eventId, httpOptions);
    }

    getEventDependents(applicationId: any, eventId: any) {
        const httpOptions = { headers: Helpers.getTokenHeader() };
        return this.http.get(this.WMS_URL + 'applications/' + applicationId + '/events/' + eventId+'/dependencies', httpOptions);
    }

    deleteEvent(applicationId: Number, eventId: Number) {
        const httpOptions = { headers: Helpers.getTokenHeader() };
        return this.http.delete(this.WMS_URL + 'applications/' + applicationId + '/events/' + eventId, httpOptions);
    }
getEventList(){
    const httpOptions = { headers: Helpers.getTokenHeader() };
    return this.http.get(this.WMS_URL + 'references' + '/EVENT_TYPE' , httpOptions);
}


deleteEventList(fieldId){
    const httpOptions = { headers: Helpers.getTokenHeader() };
    return this.http.delete(this.WMS_URL + 'references' + '/'+ fieldId , httpOptions);
}
}
