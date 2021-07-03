import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup} from "@angular/forms";

@Component({
  selector: 'app-report-submit-markdown',
  templateUrl: './report-submit-markdown.component.html',
  styleUrls: ['./report-submit-markdown.component.css']
})
export class ReportSubmitMarkdownComponent implements OnInit {

  public myForm: FormGroup;

  constructor(private formBuilder: FormBuilder) { }

  public ngOnInit(): void {

    // Initialize the form
    this.myForm = this.formBuilder.group({
      markdownEditor:       [null, null],
    });

  }  // end of ngOnInit()


}
