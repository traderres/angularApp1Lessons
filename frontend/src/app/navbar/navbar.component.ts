import { Component, OnInit } from '@angular/core';
import {Constants} from "../utilities/constants";

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  public reportsNavGroupClosed: boolean = true;   // Close Reports  section on page load
  public analyticsGroupClosed:  boolean = false;   // Open Analytics section on page load

  constructor() { }

  ngOnInit(): void {
  }

  public toggleNavGroup(aNavGroupNumber: number) {
    if (aNavGroupNumber == 1) {
      // User clicked on the Reports navgroup (so hide the other nav-group)
      this.analyticsGroupClosed = true;

      // Toggle the Reports navgroup (So, it switches from opened to close)(
      this.reportsNavGroupClosed = ! this.reportsNavGroupClosed;
    }
    else if (aNavGroupNumber == 2) {
      // User clicked on the Analytics navgroup (so hide the other nav-group)
      this.reportsNavGroupClosed = true;

      // Toggle the Analytics navgroup
      this.analyticsGroupClosed = ! this.analyticsGroupClosed;
    }
  }

  public downloadHelpFile(): void {
    // Open the help.pdf in another tab
    window.open('./assets/help.pdf', "_blank");
  }

  public get constants(): typeof Constants {
    // Get a reference to the enumerated object
    // -- This is needed so that the html page can use the enum class
    return Constants;
  }
}
