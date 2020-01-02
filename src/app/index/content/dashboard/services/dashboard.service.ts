import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Helpers } from '../../../../helpers/helpers';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  senderURL = Helpers.somSenderUrl;
  constructor(private http: HttpClient) { }

  getYearlyData() {
    const httpOptions = { headers: Helpers.getTokenHeader() };
    return this.http.get(this.senderURL + 'reports/yearly', httpOptions);
  }

  getDailyData() {
    const httpOptions = { headers: Helpers.getTokenHeader() };
    return this.http.get(this.senderURL + 'reports/daily', httpOptions);
  }

  getMonthlyData() {
    const httpOptions = { headers: Helpers.getTokenHeader() };
    return this.http.get(this.senderURL + 'reports/monthly', httpOptions);
  }

  getWeeklyData() {
    const httpOptions = { headers: Helpers.getTokenHeader() };
    return this.http.get(this.senderURL + 'reports/weekly', httpOptions);
  }
}
