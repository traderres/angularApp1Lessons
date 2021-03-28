import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  public reportsNavGroupClosed: boolean = true;
  public analyticsGroupClosed: boolean = true;

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


}
