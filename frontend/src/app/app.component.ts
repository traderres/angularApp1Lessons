import {Component, OnDestroy, OnInit} from '@angular/core';
import {NavbarService} from "./services/navbar.service";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'frontend';

  public  isSideNavVisible = true;    // The left nav starts out as visible
  private showSideNavSubscription: Subscription;


  constructor(private navbarService: NavbarService)
  { }


  public ngOnInit(): void {
    // This app-component will listen for messages from the navbarService
    this.showSideNavSubscription =
      this.navbarService.get().subscribe(sideNav => {
        // We received a message from the navbarService
        // -- Someone has toggled the navbar.

        // Switch the flag (which causes the navbar to show/hide
        this.isSideNavVisible = sideNav;
      });
  }

  public ngOnDestroy() {
    this.showSideNavSubscription.unsubscribe();
  }
}
