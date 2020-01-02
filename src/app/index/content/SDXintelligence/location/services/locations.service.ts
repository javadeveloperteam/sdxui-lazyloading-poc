import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Helpers } from 'src/app/helpers/helpers';
import { BehaviorSubject } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class LocationsService {
  wmsURL = Helpers.WMS_URL;

  public LocationData = null;

  constructor(private http: HttpClient) {

  }

  public setLocationData(data: any): void {
    this.LocationData = data;
  }

  public getLocationData(): any {
    return this.LocationData;
  }

  getAllLocation() {
    const httpOptions = { headers: Helpers.getTokenHeader() };

    return this.http.get(this.wmsURL + "locations", httpOptions);

  }
  createLocation(createData) {

    const httpOptions = { headers: Helpers.getTokenHeader() };

    return this.http.post(this.wmsURL + "locations", createData, httpOptions);
  }
  EditLocation(locationId) {
    const httpOptions = { headers: Helpers.getTokenHeader() };

    return this.http.get(this.wmsURL + "locations" + '/' + locationId, httpOptions);
  }

  getLocationDependents(locationId) {
    const httpOptions = { headers: Helpers.getTokenHeader() };
    return this.http.get(this.wmsURL + "locations" + '/' + locationId+'/dependencies', httpOptions);
  }

  updateLocation(locationId, locationData) {
    const httpOptions = { headers: Helpers.getTokenHeader() };

    return this.http.put(this.wmsURL + "locations" + '/' + locationId, locationData, httpOptions);
  }

  deleteLocation(locationId) {
    const httpOptions = { headers: Helpers.getTokenHeader() };

    return this.http.delete(this.wmsURL + "locations" + '/' + locationId, httpOptions);
  }
}
