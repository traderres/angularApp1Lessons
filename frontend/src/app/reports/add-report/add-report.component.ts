import { Component, OnInit } from '@angular/core';
import {ReportService} from "../../services/report.service";

export class Report {
  name: string;
  priority: number;
  source: number;
  authors: string;
}

@Component({
  selector: 'app-add-report',
  templateUrl: './add-report.component.html',
  styleUrls: ['./add-report.component.css']
})
export class AddReportComponent implements OnInit {

  public report: Report;

  // Inject the ReportService into this component
  constructor(private reportService: ReportService) { }

  ngOnInit() {
    this.report = new Report();
    this.report.name = "";
    this.report.priority = 0;
    this.report.source = 0;
    this.report.authors = "";

    // Use the ReportService
    this.reportService.showMessage('Init called');
  }

  public reset() {
    this.report.name = "";
    this.report.priority = 0;
    this.report.source = 0;
    this.report.authors = "";

    this.reportService.showMessage('User pressed RESET');
  }

  public save() {
    console.log('save() started  this.report=' , this.report);


    this.reportService.showMessage('User pressed SAVE');
  }
}
