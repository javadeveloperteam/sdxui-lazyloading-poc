import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Helpers } from '../../../../helpers/helpers';

@Injectable({
    providedIn: 'root'
})
export class GroupService {

    senderURL: string = Helpers.somSenderUrl;

    constructor(private http: HttpClient) { }


    getAllGroupsByType(type:any) {
        const httpOptions = { headers: Helpers.getTokenHeader() };
        
        return this.http.get(this.senderURL + 'groups/?group_type='+type, httpOptions);
    }

    getAllGroups() {
        const httpOptions = { headers: Helpers.getTokenHeader() };
        return this.http.get(this.senderURL + 'groups', httpOptions);
    }

    getAllGroupsOrByType(type:any) {
        const httpOptions = { headers: Helpers.getTokenHeader() };
        if(type == null)
        {
            return this.http.get(this.senderURL + 'groups', httpOptions);
        }else
        {
            return this.http.get(this.senderURL + 'groups/?group_type='+type, httpOptions);
        }
    }

    createGroup(value: any) {
        const httpOptions = { headers: Helpers.getTokenHeader() };
        const body = JSON.stringify(value);
        return this.http.post(this.senderURL + 'groups', body, httpOptions);
    }

    updateGroup(value: any) {
        const httpOptions = { headers: Helpers.getTokenHeader() };
        const body = JSON.stringify(value);
        return this.http.put(this.senderURL + 'groups/'+value.groupId, body, httpOptions);
    }

    getGroup(id:any) {
        const httpOptions = { headers: Helpers.getTokenHeader() };
        return this.http.get(this.senderURL + 'groups/'+id, httpOptions);
    }

    deleteGroup(id: Number) {
        const httpOptions = { headers: Helpers.getTokenHeader() };
        return this.http.delete(this.senderURL + 'groups/'+id, httpOptions);
    }

    deleteGroupMember(id: Number) {
        const httpOptions = { headers: Helpers.getTokenHeader() };
        return this.http.delete(this.senderURL + 'groups/members/'+id, httpOptions);
    }
}
