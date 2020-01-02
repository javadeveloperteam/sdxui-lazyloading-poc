import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Helpers } from '../../../../helpers/helpers';

@Injectable({
    providedIn: 'root'
})
export class DestinationService {

    senderURL: string = Helpers.somSenderUrl;
    constructor(private http: HttpClient) { }

    getDestinationList(userId){
        const httpOptions = {  headers: Helpers.getTokenHeader() };
        return this.http.get(this.senderURL + 'users/' + userId + '/destinations', httpOptions);
      }
    getAllDestination() {
        const httpOptions = { headers: Helpers.getTokenHeader() };
        return this.http.get(this.senderURL + 'destinations', httpOptions);
    }

    createDestination(value: any) {
        const httpOptions = { headers: Helpers.getTokenHeader() };
        const body = JSON.stringify(value);
        return this.http.post(this.senderURL + 'destinations', body, httpOptions);
    }

    getAllDestinationOrByType(type:any) {
        const httpOptions = { headers: Helpers.getTokenHeader() };
        if(type == null)
        {
            return this.http.get(this.senderURL + 'destinations', httpOptions);
        }else{
            return this.http.get(this.senderURL + 'destinations?destination_type='+type, httpOptions);
        }
    }

    getAllDestinationByType(type : String) {
        const httpOptions = { headers: Helpers.getTokenHeader() };
        return this.http.get(this.senderURL + 'destinations?destination_type='+type, httpOptions);
    }

    updateDestination(value: any) {
        const httpOptions = { headers: Helpers.getTokenHeader() };
        const body = JSON.stringify(value);
        return this.http.put(this.senderURL + 'destinations/'+value.destinationId, body, httpOptions);
    }

    getDestination(id:any) {
        const httpOptions = { headers: Helpers.getTokenHeader() };
        return this.http.get(this.senderURL + 'destinations/'+id, httpOptions);
    }

    deleteDestination(id: Number) {
        const httpOptions = { headers: Helpers.getTokenHeader() };
        return this.http.delete(this.senderURL + 'destinations/'+id, httpOptions);
    }

}
