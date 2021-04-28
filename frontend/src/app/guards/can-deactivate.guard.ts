import { Injectable } from '@angular/core';
import {ActivatedRouteSnapshot, CanDeactivate, RouterStateSnapshot, UrlTree} from "@angular/router";
import {Observable} from "rxjs";


export interface CanComponentDeactivate {

  canDeactivate: () => Observable<boolean | UrlTree> |
    Promise<boolean | UrlTree> | boolean | UrlTree;

}



@Injectable()
export class CanDeactivateGuard implements CanDeactivate<CanComponentDeactivate> {

  public canDeactivate(aComponent: CanComponentDeactivate,
                       aRoute: ActivatedRouteSnapshot,
                       AState: RouterStateSnapshot) {
    return aComponent.canDeactivate ? aComponent.canDeactivate() : true;
  }

}
