import {Component, OnInit} from '@angular/core';
import {BannerService} from "../services/banner.service";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-user-navbar',
  templateUrl: './user-navbar.component.html',
  styleUrls: ['./user-navbar.component.css']
})
export class UserNavbarComponent implements OnInit {

  public bannerIsVisible: boolean;
  private bannerSubscription: Subscription;

  constructor(public bannerService: BannerService) { }

  public ngOnInit(): void {

    this.bannerSubscription = this.bannerService.getStateAsObservable().subscribe( (aCurrentValue: boolean) => {
      // We received a message from the banner service with the value
      this.bannerIsVisible = aCurrentValue;
    })

  }

}
