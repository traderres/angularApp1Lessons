import { Injectable } from '@angular/core';
import {BehaviorSubject, Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class BannerService {
  private bannerStateSubject = new BehaviorSubject<boolean>(true);   // Initialize the banner state to true

  constructor() { }


  public getStateAsObservable(): Observable<boolean> {
    return this.bannerStateSubject.asObservable();
  }

  public hideBanner(): void {
    // Send a message with false  (to tell anyone listening to hide the banner)
    this.bannerStateSubject.next(false);
  }

  public showBanner(): void {
    // Send a message with true  (to tell anyone listening to show the banner)
    this.bannerStateSubject.next(true);
  }

}
