import { Injectable } from '@angular/core';
import {Observable, Subject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class NavbarService {

  public isNavbarDisplayed = true;
  private showSideNavSubject = new Subject<boolean>();

  public constructor() { }

  public toggleNavbar(): void {
    this.isNavbarDisplayed = !this.isNavbarDisplayed;

    // Send a message to the navbar (to tell the navbar to show or hide)
    this.showSideNavSubject.next(this.isNavbarDisplayed);
  }

  public get(): Observable<boolean> {
    return this.showSideNavSubject.asObservable();
  }
}

