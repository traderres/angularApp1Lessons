import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from "rxjs";
import {NavbarService} from "./services/navbar.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'AngularApp1';

  public isAppNavVisible = true;       // The left nav starts out as visible
  public isUserNavVisible = false;    // The right nav starts out as not visible

  private showNavSubscription: Subscription;

  constructor(private navbarService: NavbarService)
  { }


  public ngOnInit(): void {

    // This app-component will listen for messages from the navbarService
    this.showNavSubscription =
      this.navbarService.getNavbarStateAsObservable().subscribe((navbarState) => {
        // We received a message from the navbarService
        // -- Someone has toggled the one of the navbars

        // Set the public properties based on the navbarState properties returned
        this.isAppNavVisible = navbarState.isAppNavbarDisplayed;
        this.isUserNavVisible = navbarState.isUserNavbarDisplayed;
      });
  }


  public ngOnDestroy() {
    this.showNavSubscription.unsubscribe();
  }

}
