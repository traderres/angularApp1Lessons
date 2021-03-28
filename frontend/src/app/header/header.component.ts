
import { Component, OnInit } from '@angular/core';
import {NavbarService} from "../services/navbar.service";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  constructor(private navbarService: NavbarService)
  {}

  ngOnInit(): void {   }

  public toggle(): void {
    // Send a message to the navbarService (to tell it to toggle)
    this.navbarService.toggleNavbar();
  }
}
