import {Component, OnInit} from '@angular/core';
import {ThemeOptionDTO} from "../models/ThemeOptionDTO";
import {ThemeService} from "../services/theme.service";
import {Observable} from "rxjs";

@Component({
  selector: 'app-theme-changer-menu',
  templateUrl: './theme-changer-menu.component.html',
  styleUrls: ['./theme-changer-menu.component.css']
})
export class ThemeChangerMenuComponent implements OnInit {


  public selectedThemeName: string = "deeppurple-amber-modified";

  public themeOptions: Observable<ThemeOptionDTO[]>;


  constructor(private themeService: ThemeService) {
    this.themeOptions = this.themeService.getThemeOptions();
  }

  ngOnInit(): void {
  }

  public changeTheme(aThemeName: ThemeOptionDTO) {
    this.selectedThemeName = aThemeName.themeName;

    this.themeService.setTheme(aThemeName);
  }

}
