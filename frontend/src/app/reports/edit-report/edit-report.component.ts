import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {ErrorService} from "../../errorHandler/error.service";
import {HttpErrorResponse} from "@angular/common/http";
import {isNumeric} from "rxjs/internal-compatibility";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {GetUpdateReportDTO} from "../../models/get-update-report-dto";
import {ReportService} from "../../services/report.service";
import {Observable} from "rxjs";
import {tap} from "rxjs/operators";

@Component({
  selector: 'app-edit-report',
  templateUrl: './edit-report.component.html',
  styleUrls: ['./edit-report.component.css']
})
export class EditReportComponent implements OnInit {

  public reportId: number;
  public myForm: FormGroup;
  public formInfoObs: Observable<GetUpdateReportDTO>

  constructor(private activatedRoute: ActivatedRoute,
              private errorService: ErrorService,
              private formBuilder: FormBuilder,
              private reportService: ReportService) {
  }


  public ngOnInit(): void {
    // Get the raw id from the activatedRoute
    let rawId: string | null = this.activatedRoute.snapshot.paramMap.get("id");

    if (! isNumeric(rawId))  {
      // No id was passed-in.  So, display an error and stop here
      this.errorService.addError(new HttpErrorResponse({
        statusText: "Invalid Page Parameters",
        error:      "The Report ID is invalid or not passed-in"
      }));

      // Stop here -- so the user sees nothing on the edit reports page
      return;
    }

    // Convert the rawId into a numeric value (using the plus sign trick)
    this.reportId = +rawId;

    // Initialize the reactive form
    this.myForm = this.formBuilder.group({
      report_name: [null,
        [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(100)
        ]],

      source: ['',  null],

      priority:  ['', Validators.required]
    });

    // Setup the observable so that the async pipe will subscribe and unsubscribe
    this.formInfoObs = this.reportService.getEditReportInfo(this.reportId).pipe(
      tap(  (aData: GetUpdateReportDTO) => {
        // The REST call came back.  Get the data before it hits the HTML page
        this.populateFormFields(aData);
      }));
  }

  /*
   * Initialize the reactive form with data (retrieved from the back-end)
   */
  private populateFormFields(aData: GetUpdateReportDTO) {
    this.myForm.controls.report_name.setValue(  aData.report_name );
    this.myForm.controls.priority.setValue(     aData.priority );
  }


}
