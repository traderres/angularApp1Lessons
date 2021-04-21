import { Injectable } from '@angular/core';
import {ReportDTO} from "../models/report-dto";
import {Observable, of} from "rxjs";
import {environment} from "../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {GetReportDTO} from "../models/get-report-dto";

@Injectable({
  providedIn: 'root'
})
export class ReportService {

  constructor(private httpClient: HttpClient) { }

  /*
     * Return an observable that will add a Reports record to the system
     */
  public add(report: ReportDTO): Observable<string> {
    // Construct the URL for the REST endpoint (so it works in dev and prod mode)
    const restUrl = environment.baseUrl + '/api/reports/add';

    // NOTE:  The REST call is not invoked you call subscribe() on this observable
    return this.httpClient.post(restUrl, report, {responseType: 'text'});
  }



  /*
   * showMessage()  Demonstrate Sharing Code
   */
  public showMessage(aMessage: string): void {
    console.log('Here is the message: ' + aMessage);
  }


  /*
   * Returns an observable that holds an array of GetReportDTO objects
   */
  public getAllReports(): Observable<GetReportDTO[]> {
    // Construct the URL of the REST call
    const restUrl = environment.baseUrl + '/api/reports/all';

    // Return an observable
    return this.httpClient.get <GetReportDTO[]>(restUrl);
  }

}
