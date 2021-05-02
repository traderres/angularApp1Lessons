import { Component, OnInit } from '@angular/core';
import {FileUploader, ParsedResponseHeaders} from "ng2-file-upload";
import {environment} from "../../../environments/environment";
import {MessageService} from "../../services/message.service";


const backendUploadUrl = environment.baseUrl + '/api/reports/upload';

@Component({
  selector: 'app-upload-report',
  templateUrl: './upload-report.component.html',
  styleUrls: ['./upload-report.component.css']
})
export class UploadReportComponent implements OnInit {

  // Make sure the itemAlias matches the
  //     @RequestParam(value = "file" in the REST endpoint on backend
  //
  public uploader: FileUploader = new FileUploader(
    {
      url: backendUploadUrl,
      queueLimit: 1,
      itemAlias: 'file'
    });

  constructor(private messageService: MessageService) { }

  ngOnInit(): void {
    this.uploader.onAfterAddingFile = (file) => {
      // This call is need to make the upload work with spring security
      file.withCredentials = false;
    };

    this.uploader.onCompleteItem = (item, response, status, headers) =>
      this.onCompleteItem(item, response, status, headers);
  }


  onCompleteItem(item: any, response: any, status: number, headers: ParsedResponseHeaders): any {
    // Send a message to the user letting him know if it worked
    let message = " status=" + status + "   response=" + response;
    this.messageService.showSuccessMessage(message);
  }

}
