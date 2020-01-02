import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Helpers } from '../../../../helpers/helpers';

@Injectable({
    providedIn: 'root'
})
export class MessageService {
    senderURL: string = Helpers.somSenderUrl;
    constructor(private http: HttpClient) { }

    getMessageList() {
        const httpOptions = { headers: Helpers.getTokenHeader() };
        return this.http.get(this.senderURL + "messages", httpOptions);
    }

    getMessageListWithFilter(startDate : any, endDate : any, dateFilter : any) {
        const httpOptions = { headers: Helpers.getTokenHeader() };
        let url_option = '';
        url_option += startDate != null ? 'start_date='+startDate :'';
        url_option += endDate != null ? '&end_date='+endDate :'';
        url_option += dateFilter != null ? 'date_filter_value='+dateFilter :'';
        return this.http.get(this.senderURL + "messages?"+url_option, httpOptions);
    }

    deleteMessage(value: any) {
        const httpOptions = { headers: Helpers.getTokenHeader() };
        return this.http.delete(this.senderURL + 'messages/' + value, httpOptions);
    }

    updateMessageStatus(messageId: any, messageStatus: String) {
        return this.http.put(this.senderURL + "messages/ackstatus/" + messageId + "?message_status=" + messageStatus, null, { headers: Helpers.getTokenHeader() ,responseType : 'text'});
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
