import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ValidatorUtils} from "../../validators/validator-utils";
import {MessageService} from "../../services/message.service";
import {LookupDTO} from "../../models/lookup-dto";
import {LookupService} from "../../services/lookup.service";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-add-report2',
  templateUrl: './add-report2.component.html',
  styleUrls: ['./add-report2.component.css']
})
export class AddReport2Component implements OnInit, OnDestroy {

  public myForm: FormGroup;
  public priorities: LookupDTO[];
  private lookupSubscription: Subscription;

  constructor(private messageService: MessageService,
              private formBuilder: FormBuilder,
              private lookupService: LookupService) { }

  public ngOnInit(): void {

    this.myForm = this.formBuilder.group({
      report_name: [null,
        [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(100)
        ]],

      source: ['',  null],

      priority:  ['', Validators.required],

      authors:  ['',
        [
          Validators.required,
          ValidatorUtils.validateMultipleSelect(1,2)
        ]]
    });


    // Invoke the REST end point
    this.lookupSubscription = this.lookupService.getLookupWithType("priority").subscribe(data => {
        // The REST call finished successfully

        // Get the data from the REST call
        this.priorities = data;
      },

      (err) => {
        // REST Call call finished with an error
        console.error(err);

      }).add( () => {
      // Code to run after the REST call finished

      // Unset the flag so that the dropdown appears
      console.log('rest call tear down code');
    });

  }


  public reset(): void {
    console.log('user pressed reset');
    this.myForm.reset();
  }

  public save(): void {
    console.log('User pressed save.');

    // Mark all fields as touched so the user can see any errors
    this.myForm.markAllAsTouched();

    if (this.myForm.invalid) {
      // User did not pass validation so stop here
      return;
    }

    // User enter valid data
    console.log('Valid data:  report_name=' + this.myForm.controls.report_name.value);

    // Send a message
    this.messageService.showErrorMessage("Failed to save your record.  An error occurred.");
  }


  public ngOnDestroy(): void {

    if (this.lookupSubscription) {
      // Unsubscribe from this subscription so we don't have a memory leak
      this.lookupSubscription.unsubscribe();
    }

  }
}
