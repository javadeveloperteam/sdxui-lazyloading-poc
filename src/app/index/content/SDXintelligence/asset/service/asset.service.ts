import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Helpers } from 'src/app/helpers/helpers';

@Injectable({
  providedIn: 'root'
})
export class AssetService {
  wmsURL = Helpers.WMS_URL;


  constructor(private http: HttpClient) { }
  

  getAllAsset(){
    const httpOptions = { headers: Helpers.getTokenHeader() };

    return this.http.get(this.wmsURL + "assets", httpOptions);

  }

  getAssetDependents(id:any) {
    const httpOptions = { headers: Helpers.getTokenHeader() };
    return this.http.get(this.wmsURL + 'assets/'+id+'/dependencies', httpOptions);
  }

  deleteAsset(assetId){
    const httpOptions = { headers: Helpers.getTokenHeader() };

    return this.http.delete(this.wmsURL + "assets"+'/'+ assetId, httpOptions);  
  }
  
  createAsset(assetData){
    const httpOptions = { headers: Helpers.getTokenHeader() };

    return this.http.post(this.wmsURL + "assets",assetData, httpOptions);  
  }
  EditAsset(assetId){
    const httpOptions = { headers: Helpers.getTokenHeader() };

    return this.http.get(this.wmsURL + "assets"+'/'+ assetId, httpOptions);
  }
  updateAsset(assetId,assetData){
    const httpOptions = { headers: Helpers.getTokenHeader() };

    return this.http.put(this.wmsURL + "assets"+'/'+ assetId ,assetData, httpOptions);
  }

}
