import { Component, OnInit } from '@angular/core';
import {ReportService} from "../../services/report.service";
import {NgForm} from "@angular/forms";

export class Report {
  name: string | null;
  priority: number | null;
  source: number | null;
  authors: string | null
}

@Component({
  selector: 'app-add-report',
  templateUrl: './add-report.component.html',
  styleUrls: ['./add-report.component.css']
})
export class AddReportComponent implements OnInit {

  public report: Report;
  public formSubmitted: boolean = false;

  // Inject the ReportService into this component
  constructor(private reportService: ReportService) { }

  ngOnInit() {
    this.report = new Report();
    this.report.name = null;
    this.report.priority = null;
    this.report.source = null;
    this.report.authors = null;

    // Use the ReportService
    this.reportService.showMessage('Init called');
  }

  public reset(aForm:  NgForm): void {
    // Reset the form back to pristine/untouched condition
    aForm.resetForm();

    this.formSubmitted = false;
  }

  public save(aForm: NgForm): void {
    this.formSubmitted = true;

    // Mark all form fields as touched -- so that error validation displays
    aForm.form.markAllAsTouched();

    if (aForm.valid) {
      // Invoke a service to save the record
      console.log("Save record.");

      // Reset the form
      aForm.resetForm();
      this.formSubmitted = false;
    }
  }
}
