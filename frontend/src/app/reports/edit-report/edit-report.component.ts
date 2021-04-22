import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {ErrorService} from "../../errorHandler/error.service";
import {HttpErrorResponse} from "@angular/common/http";
import {isNumeric} from "rxjs/internal-compatibility";

@Component({
  selector: 'app-edit-report',
  templateUrl: './edit-report.component.html',
  styleUrls: ['./edit-report.component.css']
})
export class EditReportComponent implements OnInit {

  public reportId: number;

  constructor(private activatedRoute: ActivatedRoute,
              private errorService: ErrorService) {
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
  }



}
