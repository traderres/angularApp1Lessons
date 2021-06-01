import { Injectable } from '@angular/core';
import {CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router} from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PageGuard implements CanActivate {

  public constructor(private router: Router) {
  }

  public canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    // If the user is not allowed to get to this page, then redirct the user to a forbidden page
    this.router.navigate(['page/403']).then();

    // Return false so that the router will not route the user to the new page
    return false;
  }

}
