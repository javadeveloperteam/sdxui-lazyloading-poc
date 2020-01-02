import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../../../../environments/environment';
import { Observable } from 'rxjs';
import { Helpers } from '../../../../../helpers/helpers';

@Injectable({
  providedIn: 'root'
})
export class EventStatusService {
  
  url = environment.somSinkUrl;

  constructor(private http: HttpClient) { }

  getEventRecords(): Observable<EventRecord[]> {
    const httpOptions = { headers: Helpers.getTokenHeader() };
    const records_url = this.url.concat('events/summary/latest');
    return this.http.get<EventRecord[]>(records_url,httpOptions);
  }

  getEventRecordsBySearch(startDate: any, endDate: any,
    dateFilter: any){
      const search_url = this.url.concat('events/summary/latest');
      let params = new HttpParams();
     params = startDate != null ? params.set('start_date',startDate) :params;
     params = endDate != null ? params.set('end_date',endDate) :params;
     params = dateFilter != null ? params.set('date_filter_value',dateFilter) :params;

      const options = { params: params, headers: Helpers.getTokenHeader() };
      return this.http.get<EventRecord[]>(search_url ,options);
  }

  getEventRecordById(recordId: string): Observable<any> {
    const url = this.url.concat('events/'+recordId);   
    return this.http.get<any>(url);
  }
}
export interface EventRecord{
    "applicationId": number;
    "applicationName": string;
    "assetId": number;
    "assetName": string;
    "createdOn": string;
    "eventId": number;
    "eventName": string;
    "eventRecordId": string;
    "eventStatus": string;
    "modifiedOn": string;
}