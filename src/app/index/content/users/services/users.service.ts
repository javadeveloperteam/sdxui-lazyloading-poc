import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Helpers } from '../../../../helpers/helpers';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class UsersService {

    adminURL = Helpers.somAdminUrl;

    public ContactData = null;

    constructor(private http: HttpClient) { }

    verify() {
        return this.http.get(this.adminURL + 'validateUser', this.jwt());
    }
    public setContactData(data: any): void {
        this.ContactData = data;
    }

    public getContactData(): any {
        return this.ContactData;
    }

    createUser(formdata: FormData) {
        const httpOptions = { headers: Helpers.getTokenHeaderForFormData() };
        return this.http.post(this.adminURL + "users", formdata, httpOptions);
    }

    updateUser(formdata: FormData) {
        const httpOptions = { headers: Helpers.getTokenHeaderForFormData() };
        return this.http.put(this.adminURL + 'users', formdata, httpOptions);
    }

    getUser(value: any) {
        const httpOptions = { headers: Helpers.getTokenHeader() };
        return this.http.get(this.adminURL + 'users/' + value, httpOptions);
    }

    searchUser(value: any) {
        return this.http.post(this.adminURL + 'searchUser', value);
    }

    deleteUser(value: any) {
        const httpOptions = { headers: Helpers.getTokenHeader() };
        return this.http.delete(this.adminURL + 'users/' + value, httpOptions);
    }

    blockUser(value: any) {
        const httpOptions = { headers: Helpers.getTokenHeader() };
        return this.http.post(this.adminURL + 'blockUser', JSON.stringify(value), httpOptions);
    }

    getAllUsers() {
        const httpOptions = { headers: Helpers.getTokenHeader() };
        return this.http.get(this.adminURL + 'users', httpOptions);
    }

    getUserByCustomer() {
        const httpOptions = { headers: Helpers.getTokenHeader() };
        return this.http.post(this.adminURL + 'getUserByCustomer', "", httpOptions);
    }

    getDestinationByDetails(type: any) {
        const httpOptions = { headers: Helpers.getTokenHeader() };
        let deptForm = {};
        deptForm['type'] = type;
        return this.http.post(this.adminURL + 'fetchAllDestination', JSON.stringify(deptForm), httpOptions);
    }

    getUserByRoleName(value: String) {
        let userForm = {};
        userForm['roleName'] = value;
        let body = JSON.stringify(userForm);
        const httpOptions = { headers: Helpers.getTokenHeader() };
        return this.http.post(this.adminURL + 'getUsersListByRoleName', body, httpOptions);

    }

    getCountries() {
        const httpOptions = { headers: Helpers.getNewTokenHeader() };
        const userForm = {};
        return this.http.get(this.adminURL + 'countries', httpOptions);
    }

    getStates(value: string) {
        const httpOptions = { headers: Helpers.getNewTokenHeader() };
        return this.http.get(this.adminURL + 'countries/' + value + '/states', httpOptions);
    }

    getCities(value: string) {
        const httpOptions = { headers: Helpers.getNewTokenHeader() };
        return this.http.get(this.adminURL + 'states/' + value + '/citites', httpOptions);
    }
    getAllUsersByRoleName(roleName: String) {
        if (roleName == null) {
            return this.getAllUsers();
        } else {
            const httpOptions = { headers: Helpers.getTokenHeader() };
            return this.http.get(this.adminURL + 'users?role_name=' + roleName, httpOptions);
        }
    }

    getAllUsersByRoleNameAndDepartmentId(departmentId: any, roleName: String) {
        const httpOptions = { headers: Helpers.getTokenHeader() };
        if (departmentId == null && roleName != null) {
            return this.http.get(this.adminURL + 'users/departments?role_name=' + roleName, httpOptions);
        }
        else if(departmentId != null && roleName != null) {
            return this.http.get(this.adminURL + 'users/departments?department_id=' + departmentId + '&role_name=' + roleName, httpOptions);
        }
        else if(departmentId == null && roleName == null)
        {
            return this.getAllUsers();
        }
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
