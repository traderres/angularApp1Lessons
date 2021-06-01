import { Injectable } from '@angular/core';
import {UserInfoDTO} from "../models/user-info-dto";
import {Observable, of} from "rxjs";
import {Constants} from "../utilities/constants";

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
      [Constants.ADD_REPORTS_ROUTE, true],
      [Constants.ADD_REPORTS2_ROUTE, true],
      [Constants.LONGVIEW_REPORT, true],
      [Constants.VIEW_REPORTS_ROUTE, true],
      [Constants.AUDIT_HISTORY_ROUTE, true],
      [Constants.DASHBOARD_ROUTE, true],
      [Constants.USA_MAP_ROUTE, true],
      [Constants.CHART_DRILLDOWN_ROUTE, true],
      [Constants.LONGVIEW_INTERNAL_NAV_REPORT, true],
      [Constants.LONGVIEW_REPORT, true],
      [Constants.EDIT_REPORT_ROUTE, true],
      [Constants.SEARCH_DETAILS_ROUTE, true],
      [Constants.UPLOAD_REPORT_ROUTE, true],
      [Constants.CHART1_ROUTE, true],
      [Constants.CHART2_ROUTE, true]
    ]);

    // Return an observable that holds this information
    return of(userInfo);
  }
}
