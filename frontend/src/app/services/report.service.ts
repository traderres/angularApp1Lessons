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
    let data: GetReportDTO[] = [
      {
        id: 1,
        name: 'Report 1',
        priority: 'Low',
        start_date: '01/05/2020',
        end_date: '12/31/2020'
      },
      {
        id: 2,
        name: 'Report 2',
        priority: 'Critical',
        start_date: '11/17/2020',
        end_date: '05/11/2021'
      },
      {
        id: 3,
        name: 'Report 3',
        priority: 'High',
        start_date: '11/09/2019',
        end_date: '04/25/2021'
      }
    ]

    return of(data);
  }

}
