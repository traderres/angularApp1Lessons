import { Component, OnInit } from '@angular/core';
import {ReportService} from "../../services/report.service";
import {GetReportDTO} from "../../models/get-report-dto";
import {Observable} from "rxjs";

@Component({
  selector: 'app-view-reports',
  templateUrl: './view-reports.component.html',
  styleUrls: ['./view-reports.component.css']
})
export class ViewReportsComponent implements OnInit {

  public allReportsObs: Observable<GetReportDTO[]>;

  constructor(private reportService: ReportService) { }

  public ngOnInit(): void {
    // Get an observable to the REST call that will retrieve all reports
    // NOTE:  The Async Pipe will subscribe and unsubscribe from this automatically
    this.allReportsObs = this.reportService.getAllReports();
  }

}
