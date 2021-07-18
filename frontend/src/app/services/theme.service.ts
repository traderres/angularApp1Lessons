import { Injectable } from '@angular/core';
import {ThemeOptionDTO} from "../models/ThemeOptionDTO";
import {BehaviorSubject, Observable, of} from "rxjs";
import {StyleManagerService} from "./style-manager.service";

@Injectable({
  providedIn: 'root'
})
export class ThemeService {

  private themeStateSubject: BehaviorSubject<ThemeOptionDTO>;


  constructor(private styleManagerService: StyleManagerService) {

    let startingTheme: ThemeOptionDTO = {
        label: "Light Mode  (Deep Purple & Amber)",
        themeName: "deeppurple-amber-modified",
        isLightMode: true
      };

    // Have the themeService send an initial message with the default (light) theme
    this.themeStateSubject = new BehaviorSubject<ThemeOptionDTO>(startingTheme)
  }


  public getThemeStateAsObservable(): Observable<ThemeOptionDTO> {
    return this.themeStateSubject.asObservable();
  }


  public getThemeOptions(): Observable<ThemeOptionDTO[]> {

    let options: ThemeOptionDTO[] = [
      {
        label: "Light Mode",
        themeName: "deeppurple-amber-modified",
        isLightMode: true
      },
      {
        label: "Dark Mode",
        themeName: "purple-green-modified",
        isLightMode: false
      }
    ];

    return of(options);
  }



  public setTheme(aNewTheme: ThemeOptionDTO): void {
    console.log('setTheme()  isLightMode=', aNewTheme.isLightMode);

    // Tell Angular Material to change the theme
    this.styleManagerService.setStyle(
      "theme",
      `assets/themes/${aNewTheme.themeName}.css`
    );

    // Send a message out to the header/navbar/grid pages that the theme has changed
    this.themeStateSubject.next(aNewTheme);
  }


}
