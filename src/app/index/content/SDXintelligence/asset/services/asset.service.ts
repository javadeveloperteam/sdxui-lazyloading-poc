import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Helpers } from '../../../../../helpers/helpers';

@Injectable({
    providedIn: 'root'
})
export class AssetService {

    WMS_URL: string = Helpers.WMS_URL;

    constructor(private http: HttpClient) { }


    getAllAssets() {
        const httpOptions = { headers: Helpers.getTokenHeader() };
        return this.http.get(this.WMS_URL + 'assets', httpOptions);
    }

    createAsset(value: any) {
        const httpOptions = { headers: Helpers.getTokenHeader() };
        const body = JSON.stringify(value);
        return this.http.post(this.WMS_URL + 'assets', body, httpOptions);
    }



    updateAsset(value: any) {
        const httpOptions = { headers: Helpers.getTokenHeader() };
        const body = JSON.stringify(value);
        return this.http.put(this.WMS_URL + 'assets/'+value.assetId, body, httpOptions);
    }

    getAsset(id:any) {
        const httpOptions = { headers: Helpers.getTokenHeader() };
        return this.http.get(this.WMS_URL + 'assets/'+id, httpOptions);
    }

    deleteAsset(id: Number) {
        const httpOptions = { headers: Helpers.getTokenHeader() };
        return this.http.delete(this.WMS_URL + 'assets/'+id, httpOptions);
    }
}
