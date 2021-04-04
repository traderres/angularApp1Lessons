import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ValidatorUtils} from "../../validators/validator-utils";

@Component({
  selector: 'app-add-report2',
  templateUrl: './add-report2.component.html',
  styleUrls: ['./add-report2.component.css']
})
export class AddReport2Component implements OnInit {
  public myForm: FormGroup;

  constructor(private formBuilder: FormBuilder) { }

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
    console.log('Valid data:  report_name=' +
      this.myForm.controls.report_name.value);
  }
}
