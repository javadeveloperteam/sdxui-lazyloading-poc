import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders,HttpParams } from '@angular/common/http';
import { Helpers } from '../../../../helpers/helpers';

@Injectable({
    providedIn : 'root'
})
export class MessageService {

    senderURL: string = Helpers.somSenderUrl;

    constructor(private http: HttpClient) { }

    loadDestinationByEntity(media : string){
        const httpOptions = {  headers: Helpers.getTokenHeader(),
                               params : new HttpParams().set('destination_type', media)};
        return this.http.get(this.senderURL+'destinations',httpOptions);
    }

    loadGroupByEntity(media : string){
        const httpOptions = {  headers: Helpers.getTokenHeader(),
                               params : new HttpParams().set('group_type', media)};
        return this.http.get(this.senderURL+'groups',httpOptions);
    }

    SendMessage(formdata: FormData) {
        const headerObj = Helpers.getTokenHeaderForFormData();
        return this.http.post(this.senderURL + "messages/attachments", formdata, { headers: headerObj});
    }

}
