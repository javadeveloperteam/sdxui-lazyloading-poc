import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Helpers } from '../../../../helpers/helpers';

@Injectable({
    providedIn: 'root'
})
export class ScheduleService {

    senderURL: string = Helpers.somSenderUrl;

    constructor(private http: HttpClient) { }


    getAllSchedule() {
        const httpOptions = { headers: Helpers.getTokenHeader() };
        return this.http.get(this.senderURL + 'schedules', httpOptions);
    }

    getAllScheduleByUser(userId) {
        const httpOptions = { headers: Helpers.getTokenHeader() };
        return this.http.get(this.senderURL + 'schedules/users/'+userId, httpOptions);
    }
    createSchedule(value: any) {
        const httpOptions = { headers: Helpers.getTokenHeader() };
        const body = JSON.stringify(value);
        return this.http.post(this.senderURL + 'schedules', body, httpOptions);
    }



    updateSchedule(value: any) {
        const httpOptions = { headers: Helpers.getTokenHeader() };
        const body = JSON.stringify(value);
        return this.http.put(this.senderURL + 'schedules/'+value.scheduleId, body, httpOptions);
    }

    getSchedule(id:any) {
        const httpOptions = { headers: Helpers.getTokenHeader() };
        return this.http.get(this.senderURL + 'schedules/'+id, httpOptions);
    }

    deleteSchedule(id: Number) {
        const httpOptions = { headers: Helpers.getTokenHeader() };
        return this.http.delete(this.senderURL + 'schedules/'+id, httpOptions);
    }

    getCalendarDetails() {
    const httpOptions = { headers: Helpers.getTokenHeader() };
        const timeZone = Helpers.getTimeZone();
        return this.http.get(this.senderURL + 'calendar?time_zone='+timeZone, httpOptions);
    }

}
