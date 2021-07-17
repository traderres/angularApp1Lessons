import {Component, Input, OnInit, Output, EventEmitter} from '@angular/core';
import {ThemeOptionDTO} from "../models/ThemeOptionDTO";
import {ThemeService} from "../services/theme.service";
import {Observable} from "rxjs";

@Component({
  selector: 'app-theme-changer-menu',
  templateUrl: './theme-changer-menu.component.html',
  styleUrls: ['./theme-changer-menu.component.css']
})
export class ThemeChangerMenuComponent implements OnInit {

  public selectedThemeName: string = "deeppurple-amber";

  public themeOptions: Observable<ThemeOptionDTO[]>;


  constructor(private themeService: ThemeService) {
    this.themeOptions = this.themeService.getThemeOptions();
  }

  ngOnInit(): void {
  }

  public changeTheme(aThemeName: string) {
    this.selectedThemeName = aThemeName;

    this.themeService.setTheme(aThemeName);
  }

}
