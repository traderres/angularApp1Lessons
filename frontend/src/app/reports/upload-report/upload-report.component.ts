import { Component, OnInit } from '@angular/core';
import {FileItem, FileUploader, ParsedResponseHeaders} from "ng2-file-upload";
import {environment} from "../../../environments/environment";
import {MessageService} from "../../services/message.service";


const backendUploadUrl = environment.baseUrl + '/api/reports/upload';

@Component({
  selector: 'app-upload-report',
  templateUrl: './upload-report.component.html',
  styleUrls: ['./upload-report.component.css']
})
export class UploadReportComponent implements OnInit {

  public  selectedFileToUpload:  FileItem | null = null;
  private lastFileItemAddedToQueue: FileItem;

  // Make sure the itemAlias matches the
  //     @RequestParam(value = "file" in the REST endpoint on backend
  //
  public uploader: FileUploader = new FileUploader(
    {
      url: backendUploadUrl,
      queueLimit: 2,
      itemAlias: 'file'
    });

  constructor(private messageService: MessageService) { }

  ngOnInit(): void {
    this.uploader.onAfterAddingFile = (item: FileItem) => this.onAfterAddingFile(item);


    this.uploader.onCompleteItem = (item, response, status, headers) =>
      this.onCompleteItem(item, response, status, headers);


  }


  onCompleteItem(item: any, response: any, status: number, headers: ParsedResponseHeaders): any {
    // Send a message to the user letting him know if it worked
    let message = " status=" + status + "   response=" + response;
    this.messageService.showSuccessMessage(message);
  }


  public onFileSelected(aFiles: File[]) {
    if (aFiles.length == 0) {
      // The user cancelled selecting a file -- so stop here
      return;
    }

    if (this.selectedFileToUpload != null) {
      // Remove the old file from the queue
      this.uploader.removeFromQueue(this.selectedFileToUpload)
    }

    this.selectedFileToUpload = this.lastFileItemAddedToQueue;
  }


  /*
 * When using the FileUploader, there is an order of operations
 *  1) User selects file
 *  2) The FileUploader adds it to the queue
 *  3) onAfterAddingFile() is called
 *  4) onFileSelected() is called
 */
  private onAfterAddingFile(aFileItem: FileItem) {
    // This line is required to make upload work with spring security
    aFileItem.withCredentials = false;

    // Get a reference to the last FileItem object added to the queue
    // NOTE:  This reference is used in onFileSelected()
    this.lastFileItemAddedToQueue = aFileItem;
  }

  public clearAll(): void {
    this.uploader.clearQueue();
    this.selectedFileToUpload = null;
  }


}
