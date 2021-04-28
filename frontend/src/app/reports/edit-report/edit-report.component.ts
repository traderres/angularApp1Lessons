import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, NavigationStart, Router, UrlTree} from "@angular/router";
import {ErrorService} from "../../errorHandler/error.service";
import {HttpErrorResponse} from "@angular/common/http";
import {isNumeric} from "rxjs/internal-compatibility";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {GetUpdateReportDTO} from "../../models/get-update-report-dto";
import {ReportService} from "../../services/report.service";
import {Observable, of, Subscription} from "rxjs";
import {catchError, debounceTime, finalize, map, tap} from "rxjs/operators";
import {SetUpdateReportDTO} from "../../models/set-update-report-dto";
import {MessageService} from "../../services/message.service";
import {CanComponentDeactivate} from "../../guards/can-deactivate.guard";

@Component({
  selector: 'app-edit-report',
  templateUrl: './edit-report.component.html',
  styleUrls: ['./edit-report.component.css']
})
export class EditReportComponent implements OnInit, OnDestroy, CanComponentDeactivate {

  public reportId: number;
  public myForm: FormGroup;
  public formInfoObs: Observable<GetUpdateReportDTO>
  public saveWhileEditingInProgress: boolean = false;
  private formChangeSubscription: Subscription;
  private routerSubscription: Subscription;


  constructor(private activatedRoute: ActivatedRoute,
              private errorService: ErrorService,
              private formBuilder: FormBuilder,
              private reportService: ReportService,
              private messageService: MessageService,
              private router: Router) {
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


    // Automatically save 5 seconds after any form change
    this.formChangeSubscription = this.myForm.valueChanges
      .pipe(
        debounceTime(5000)        // Wait 5 seconds after a form change
      ).subscribe( () => {
        // User made some changes to the form.  Save the data asynchronously
        this.saveCurrentFormAsync();
      });


    this.routerSubscription = this.router.events.subscribe(event =>{
      if (event instanceof NavigationStart){
        // Run some code asynchronously
        // NOTE:  The user will continue navigating
        console.log('user leaving page -- so save data');
        this.saveCurrentFormAsync();
      }
    });

  }

  public ngOnDestroy(): void {
    if (this.formChangeSubscription != null) {
      // Unsubscribe to avoid memory leaks
      this.formChangeSubscription.unsubscribe();
    }

    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
  }

  /*
   * Initialize the reactive form with data (retrieved from the back-end)
   */
  private populateFormFields(aData: GetUpdateReportDTO) {
    this.myForm.controls.report_name.setValue(  aData.report_name );
    this.myForm.controls.priority.setValue(     aData.priority );
  }

  /*
   * Save the information to the back-end
   */
  public save(): void {

    // Create a DTO object to send to the back-end
    let dto: SetUpdateReportDTO = new SetUpdateReportDTO();
    dto.report_name = this.myForm.controls.report_name.value;
    dto.priority    = this.myForm.controls.priority.value;
    dto.id          = this.reportId;

    this.reportService.setEditReportInfo(dto).subscribe( (response) => {
      // The REST call came back successfully
      this.messageService.showSuccessMessage('Successfully updated the report.');
    }).add( () => {
      // The REST Call finally block

    });

  }  // end of save()


  /*
   * Save the information to the back-end but to not show any popups
   */
  public saveCurrentFormAsync(): void {

    this.saveWhileEditingInProgress = true;

    // Create a DTO object to send to the back-end
    let dto: SetUpdateReportDTO = new SetUpdateReportDTO();
    dto.report_name = this.myForm.controls.report_name.value;
    dto.priority    = this.myForm.controls.priority.value;
    dto.id          = this.reportId;

    this.reportService.setEditReportInfo(dto).subscribe( (response) => {
      // The REST call came back successfully

    }).add( () => {
      // The REST Call finally block
      this.saveWhileEditingInProgress = false;
    });

  }  // end of saveCurrentFormAsync()


  /*
   * Return an observable that will cause the data to be saved
   * NOTE:  Change what the REST call returns
   *    The observable returns TRUE  if the REST call succeeds
   *    The observable returns FALSE if the REST call fails
   */
  private saveDataReturnObservable(): Observable<boolean> {

    // Create a DTO object to send to the back-end
    let dto: SetUpdateReportDTO = new SetUpdateReportDTO();
    dto.report_name = this.myForm.controls.report_name.value;
    dto.priority    = this.myForm.controls.priority.value;
    dto.id          = this.reportId;

    return this.reportService.setEditReportInfo(dto).pipe(
      map( () => {
        // The REST call finished successfully
        //  Return an observable<true> so the router can proceed to the new page)
        return true;
      }),
      catchError(() => {
        // The REST call failed.  Return observable<false> so the router stays on the page)
        // NOTE:  The ErrorInterceptor should be displaying a popup error
        return of(false);
      }),
      finalize( () => {
          // Finally block with pipes.

        }
      ));

  }  // end of saveDataReturnObservable()


  /*
   * The user is navigating to another page.  The router calls this methid before leaving the page
   * If this method returns true,  then the router *CONTINUES* to a new route
   * If this method returns false, then the router *STAYS HERE*
   */
  public canDeactivate(): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> |
    boolean | UrlTree {

    return true;
    //
    // if (! this.myForm.dirty) {
    //   // The user did *NOT CHANGE* any form field values.
    //   // So, let the router proceed to the next page
    //   return true;
    // }
    //
    // // Return an observable<boolean> so the router will *SUBSCRIBE AND WAIT*
    // //  for the REST call to finish
    // return this.saveDataReturnObservable();
  }





}
