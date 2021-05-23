import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {HttpErrorResponse} from "@angular/common/http";
import {ErrorService} from "../../errorHandler/error.service";

@Component({
  selector: 'app-search-box-details',
  templateUrl: './search-box-details.component.html',
  styleUrls: ['./search-box-details.component.css']
})
export class SearchBoxDetailsComponent implements OnInit {

  public id: string;

  constructor(private activatedRoute: ActivatedRoute,
              private errorService: ErrorService) { }

  ngOnInit(): void {
    // Get the raw id from the activatedRoute
    let rawId: string | null = this.activatedRoute.snapshot.paramMap.get("id");

    if (rawId == null)  {
      // No id was passed-in.  So, display an error and stop here
      this.errorService.addError(new HttpErrorResponse({
        statusText: "Invalid Page Parameters",
        error:      "The ID is invalid or not passed-in"
      }));

      // Stop here -- so the user sees nothing on the edit reports page
      return;
    }

    this.id = rawId;


  } // end of ngOnInit()


}
