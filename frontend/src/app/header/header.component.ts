
import { Component, OnInit } from '@angular/core';
import {NavbarService} from "../services/navbar.service";
import {ThemeService} from "../services/theme.service";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {



constructor(private navbarService: NavbarService,
            private themeService: ThemeService)  {}

  ngOnInit(): void {
    this.themeService.setTheme("deeppurple-amber");
  }

  public toggleAppNavbar(): void {
    // Send a message to the navbarService (to tell it to toggle)
    this.navbarService.toggleAppNavbar();
  }

  public toggleUserNavbar(): void {
    this.navbarService.toggleUserNavbar();
  }

  public themeChangeHandler(aThemeName: string) {
    this.themeService.setTheme(aThemeName);
  }
}
