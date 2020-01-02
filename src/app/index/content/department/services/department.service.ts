import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Helpers } from '../../../../helpers/helpers';

@Injectable({
    providedIn: 'root'
})
export class DepartmentService {

    adminURL = Helpers.somAdminUrl;
    public departmentData = null;

    constructor(private http: HttpClient) { }

    public setDepartmentData( data: any): void {
      this.departmentData = data;
    }
  
    public getDepartmentData(): any {
      return this.departmentData;
    }

    getAllDepartment() {
        const httpOptions = { headers: Helpers.getTokenHeader() };
        return this.http.get(this.adminURL + 'departments', httpOptions);
    }

    createDepartment(value: any) {
        const httpOptions = { headers: Helpers.getTokenHeader() };
        const body = JSON.stringify(value);
        return this.http.post(this.adminURL + 'departments', body, httpOptions);
    }

    updateDepartment(value: any) {
        const httpOptions = { headers: Helpers.getTokenHeader() };
        const body = JSON.stringify(value);
        return this.http.put(this.adminURL + 'departments/' + value.departmentId, body, httpOptions);
    }

    getDepartment(departmentId: any) {
        const httpOptions = { headers: Helpers.getTokenHeader() };
        return this.http.get(this.adminURL + 'departments/' + departmentId, httpOptions);
    }


    deleteDepartment(departmentId: any) {
        return this.http.delete(this.adminURL + 'departments/' + departmentId, { headers: Helpers.getTokenHeader() });
    }

}
