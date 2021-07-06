import {Component, ElementRef, HostListener, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {environment} from "../../../environments/environment";
import {CdkDragEnd} from "@angular/cdk/drag-drop";
import {NavbarService} from "../../services/navbar.service";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-pdf-viewer',
  templateUrl: './pdf-viewer.component.html',
  styleUrls: ['./pdf-viewer.component.css']
})
export class PdfViewerComponent implements OnInit, OnDestroy {
  @ViewChild("leftDiv") leftDiv: ElementRef;   // Used to get the width of left column
  @ViewChild("rightDiv") rightDiv: ElementRef; // used to get the width of right column

  public rightFlexValue: string = "50%";    // Used to set the width of the right column
  public leftFlexValue: string = "50%";     // Used to set the width of the left column
  public showDivider: boolean = true;       // Used to refresh the divider

  public  pdfSrc: string | null = null;           // Has the full path of the pdf file that the viewer will open
  private pdfSrcSampleDirectoryPath: string;      // Holds the url path to get to the assets/sample/ directory


  private secondResize: boolean = false;
  private columnResize: boolean = false;

  private navbarSubscription: Subscription;
  private adjustWidthOffsetForNavbar: number;

  constructor(private navbarService: NavbarService) { }


  /*
   * We received a resize event
   *  1) If columnResize==true, then we kicked-off this resize event.  And, we want to ignore it
   *  2) If secondResize==true, then just refresh the divider
   *  3) Else
   *       -- Calculate the left and right divs as *percentages*
   *       -- So, the web page looks good
   */
  @HostListener('window:resize', ['$event'])
  public onResize(event: any): void {
    if (this.columnResize) {
      return;
    }

    if (this.secondResize) {
      this.showDivider = true;
      this.secondResize = false;
      return;
    }

    // Calculate the width of this page
    // NOTE:  adjustWidthOffsetForNavbar = -200 if the left-side navbar is open
    //        adjustWidthOffsetForNavbar = 0    if the left-side navbar is closed
    let pageWidth: number = event.target.innerWidth + this.adjustWidthOffsetForNavbar;

    // Calculate the left and right columns as percentages
    let leftSideWidth = this.leftDiv.nativeElement.offsetWidth;

    // NOTE:  We add 10 to the left-side-width as a correction for the divider
    let leftSidePercentage = ((leftSideWidth + 10) / pageWidth) * 100;
    let rightSidePecentage = 100 - leftSidePercentage;

    // Set the new widths of the left and right columns
    this.leftFlexValue = String(leftSidePercentage) + "%";
    this.rightFlexValue = String(rightSidePecentage) + "%";

    // Refresh the divider by hiding it and showing it
    this.showDivider = false;

    // Send a resize event so that the pdf viewer will resize
    setTimeout(() => {
      this.secondResize = true;
      window.dispatchEvent(new Event('resize'));
    }, 1);

  }


  public ngOnInit(): void {

    // Setup the path of the sample directory path
    if (environment.production) {
      this.pdfSrcSampleDirectoryPath = "/app1/assets/sample/";
    }
    else {
      this.pdfSrcSampleDirectoryPath = environment.baseUrl + "/assets/sample/";
    }

    // This app-component will listen for messages from the navbarService
    this.navbarSubscription =
      this.navbarService.getNavbarStateAsObservable().subscribe((navbarState) => {
        // We received a message from the navbarService
        // -- Someone has toggled the one of the navbars

        if (navbarState.isAppNavbarDisplayed) {
          // The left-side navbar is visible (so the we need to subtract it from our calculations)
          this.adjustWidthOffsetForNavbar = -200;
        }
        else {
          this.adjustWidthOffsetForNavbar = 0;
        }
      });

  }  // end of ngOnInit()

  public ngOnDestroy(): void {
    if (this.navbarSubscription) {
      this.navbarSubscription.unsubscribe();
    }
  }

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

    // Set columnResize = true (so our own resize listener does nothing)
    this.columnResize = true;

    // Send a resize event so that the pdf viewer will resize
    setTimeout(() => {
      window.dispatchEvent(new Event('resize'));
    }, 1);

    // Refresh the divider by hiding it and showing it
    this.showDivider = false;

    // use setTimeout to show the divider (which will cause the divider to be placed in the correct spot)
    setTimeout(() => {
      this.showDivider = true;
      this.columnResize = false;
    }, 1);


  }  // end of dragEnded()

}
