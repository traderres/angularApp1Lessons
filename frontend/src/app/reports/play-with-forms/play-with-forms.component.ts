import { Component, OnInit } from '@angular/core';
import {MessageService} from "../../services/message.service";
import {Router} from "@angular/router";
import {AddReportComponent} from "../add-report/add-report.component";

@Component({
  selector: 'app-play-with-forms',
  templateUrl: './play-with-forms.component.html',
  styleUrls: ['./play-with-forms.component.css']
})
export class PlayWithFormsComponent implements OnInit {

  public isAppNew: boolean = false;
  public isUserNew: boolean = true;

  public fullname: string;
  public userTypeId: number | null;

  constructor(private messageService: MessageService,
              private router: Router) { }

  ngOnInit(): void {
  }

  public resetClicked(): void {
    this.fullname = "";
    this.userTypeId = null;
  }

  public saveClicked() {

    this.resetClicked();

    this.messageService.showSuccessMessage('Record was saved');
  }

  public goToNewUserPage(): void {
    // Navigate to the new user page
    this.router.navigate(['page/reports/add']).then();
  }
}
