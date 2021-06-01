import { Injectable } from '@angular/core';
import {UserInfoDTO} from "../models/user-info-dto";
import {Observable, of} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor() { }

  /*
   * Return an observable that holds information about the user
   * -- The UserInfoDTO holds the user's name and map of routes
   */
  public getUserInfo(): Observable<UserInfoDTO> {

    let userInfo: UserInfoDTO = new UserInfoDTO();

    userInfo.name = 'John Smith';

    userInfo.pageRoutes = new Map<string, boolean>([
      ['page/addReport', true],
      ['page/addReport2', true],
      ['page/longReport', true],
      ['page/viewReports', true],
      ['page/dashboard', false]
    ]);

    // Return an observable that holds this information
    return of(userInfo);
  }
}
