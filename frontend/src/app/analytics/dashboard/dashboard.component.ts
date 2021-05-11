import {Component, OnDestroy, OnInit} from '@angular/core';
import {BreakpointObserver, Breakpoints, BreakpointState} from "@angular/cdk/layout";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit, OnDestroy {

  public totalColumns: number;
  private cardLayoutSubscription: Subscription;

  constructor(private breakpointObserver: BreakpointObserver) { }


  public ngOnInit(): void {

    this.cardLayoutSubscription = this.breakpointObserver.observe([
      '(max-width: 799.9px)', '(min-width: 800px)', '(min-width: 1100px)'
    ]).subscribe( (state: BreakpointState) => {

      if (state.breakpoints['(min-width: 1100px)']) {
        console.log("Screen is 1100px or more.  state=", state);
        this.totalColumns = 3;
      }
      else if (state.breakpoints['(min-width: 800px)']) {
        console.log("Screen is 800px-1100px.  state=", state);
        this.totalColumns = 2;
      }
      else if (state.breakpoints['(max-width: 799.9px)']) {
        console.log("Screen is 1 to 800px.  state=", state);
        this.totalColumns = 1;
      }

    });


    // this.cardLayoutSubscription = this.breakpointObserver.observe(
    //   [Breakpoints.XLarge, Breakpoints.Large, Breakpoints.Medium, Breakpoints.Small, Breakpoints.XSmall])
    //   .subscribe((state: BreakpointState) => {
    //     // We received a message from the breakpointObserver.  The page width has adjusted.
    //
    //     if ((state.breakpoints[Breakpoints.XSmall]) || (state.breakpoints[Breakpoints.Small])) {
    //       // The browser is Small or XSmall -- so set columns to 1
    //       this.totalColumns = 1;
    //       console.log('Width is small or xsmall.  totalColumns='+ this.totalColumns);
    //
    //     } else if (state.breakpoints[Breakpoints.Medium]) {
    //       // The browser is Medium -- so set columns to 2
    //       this.totalColumns = 2;
    //       console.log('Width is medium.  totalColumns=' + this.totalColumns);
    //
    //     } else {
    //       // The browser is larger or greater -- so set the columns to 3
    //       this.totalColumns = 3;
    //       console.log('Width is large or greater.  totalColumns=' + this.totalColumns);
    //     }
    //
    //   });

  }  // end of ngOnOnit()


  public ngOnDestroy(): void {
    if (this.cardLayoutSubscription) {
      // Unsubscribe from the subscription (to avoid memory leaks)
      this.cardLayoutSubscription.unsubscribe();
    }
  }

}
