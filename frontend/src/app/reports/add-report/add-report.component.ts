import { Component, OnInit } from '@angular/core';

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

  constructor() { }

  ngOnInit() {
    this.report = new Report();
    this.report.name = "";
    this.report.priority = 0;
    this.report.source = 0;
    this.report.authors = "";
  }

  public reset() {
    this.report.name = "";
    this.report.priority = 0;
    this.report.source = 0;
    this.report.authors = "";
  }

  public save() {
    console.log('save() started  this.report=' , this.report);
  }
}
