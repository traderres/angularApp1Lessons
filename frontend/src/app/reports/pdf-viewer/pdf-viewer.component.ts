import {Component, ElementRef, HostListener, OnInit, ViewChild} from '@angular/core';
import {environment} from "../../../environments/environment";
import {CdkDragEnd} from "@angular/cdk/drag-drop";

@Component({
  selector: 'app-pdf-viewer',
  templateUrl: './pdf-viewer.component.html',
  styleUrls: ['./pdf-viewer.component.css']
})
export class PdfViewerComponent implements OnInit {
  @ViewChild("leftDiv") leftDiv: ElementRef;   // Used to get the width of left column
  @ViewChild("rightDiv") rightDiv: ElementRef; // used to get the width of right column

  public rightFlexValue: string = "50%";    // Used to set the width of the right column
  public leftFlexValue: string = "50%";     // Used to set the width of the left column
  public showDivider: boolean = true;       // Used to refresh the divider

  public  pdfSrc: string | null = null;           // Has the full path of the pdf file that the viewer will open
  private pdfSrcSampleDirectoryPath: string;      // Holds the url path to get to the assets/sample/ directory

  constructor() { }

  public ngOnInit(): void {

    // Setup the path of the sample directory path
    if (environment.production) {
      this.pdfSrcSampleDirectoryPath = "/app1/assets/sample/";
    }
    else {
      this.pdfSrcSampleDirectoryPath = environment.baseUrl + "/assets/sample/";
    }

  }  // end of ngOnInit()


  public showSampleFileInPdfViewer(aFilename: string): void {
    // Set the pdfSrc file path
    // NOTE:  IF the pdfSrc file path is valid, then pdf viewer will display the PDF file
    this.pdfSrc = this.pdfSrcSampleDirectoryPath + aFilename;
  }


  public clearPdfViewer(): void {
    this.pdfSrc = null;
  }


  /*
   * The drag-and-drop operation finished
   *
   *  1) Calculate the new width of the left and right columns
   *  2) Set the new widths of the left and right columns
   *  3) Send a resize event (so the pdf-viewer resizes)
   *  4) Show & Hide the divider (so it appears in the correct place)
   */
  public dragEnded(aEvent: CdkDragEnd): void {

    // Get the total number of pixels that were dragged
    let changeInX: number = aEvent.distance.x;

    // Calculate the new widths of the left and right columns
    let leftSideNewWidth = this.leftDiv.nativeElement.offsetWidth + changeInX;
    let rightSideNewWidth = this.rightDiv.nativeElement.offsetWidth - changeInX;

    // Set the new widths of the left and right columns
    this.leftFlexValue = leftSideNewWidth + "px";
    this.rightFlexValue = rightSideNewWidth + "px";

    // Send a resize event so that the pdf viewer will resize
    setTimeout(() => {
      window.dispatchEvent(new Event('resize'));
    }, 1);

    // Refresh the divider by hiding it and showing it
    this.showDivider = false;

    // use setTimeout to show the divider (which will cause the divider to be placed in the correct spot)
    setTimeout(() => {
      this.showDivider = true;
    }, 1);


  }  // end of dragEnded()

}
