import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {Observable} from "rxjs";
import {SetPreferenceDTO} from "../models/set-preference-dto";
import {GetOnePreferenceDTO} from "../models/get-one-preference-dto";

@Injectable({
  providedIn: 'root'
})
export class PreferenceService {


  constructor(private httpClient: HttpClient) { }


  public getPreferenceValueForPage(aPreferenceName: string, aPage: string): Observable<GetOnePreferenceDTO> {
    // Construct the URL for the REST endpoint  (to get the grid preferences for this page)
    const restUrl = environment.baseUrl + `/api/preferences/get/${aPreferenceName}/${aPage}`;

    // NOTE:  The REST call is not invoked you call subscribe() on this observable
    return this.httpClient.get <GetOnePreferenceDTO> (restUrl);
  }


  public getPreferenceValueWithoutPage(aPreferenceName: string): Observable<GetOnePreferenceDTO> {
    // Construct the URL for the REST endpoint  (to get the grid preferences for this page)
    const restUrl = environment.baseUrl + `/api/preferences/get/${aPreferenceName}`;

    // NOTE:  The REST call is not invoked you call subscribe() on this observable
    return this.httpClient.get <GetOnePreferenceDTO> (restUrl);
  }


  public setPreferenceValueWithoutPage(aPreferenceName: string, aPreferenceValue: any): Observable<string> {
    // Construct the URL for the REST endpoint  (to set the banner preference only)
    const restUrl = environment.baseUrl + '/api/preferences/set';

    let setPreferenceDTO: SetPreferenceDTO = new SetPreferenceDTO();
    setPreferenceDTO.name = aPreferenceName;
    setPreferenceDTO.value = aPreferenceValue;

    // Return an observable to this POST REST call
    // -- The 2nd {} is the json body sent to the REST call
    // -- The 3rd {} is the map of options
    return this.httpClient.post(restUrl, setPreferenceDTO, {responseType: 'text'} );
  }


  public setPreferenceValueForPage(aPreferenceName: string, aPreferenceValue: any, aPage: string): Observable<string> {
    // Construct the URL for the REST endpoint  (to set the banner preference only)
    const restUrl = environment.baseUrl + '/api/preferences/page/set';

    let setPreferenceDTO: SetPreferenceDTO = new SetPreferenceDTO();
    setPreferenceDTO.name = aPreferenceName;
    setPreferenceDTO.value = aPreferenceValue;
    setPreferenceDTO.page = aPage;

    // Return an observable to this POST REST call
    // -- The 2nd {} is the json body sent to the REST call
    // -- The 3rd {} is the map of options
    return this.httpClient.post(restUrl, setPreferenceDTO, {responseType: 'text'} );
  }


  public setPreferenceValueForPageUsingJson(aPreferenceName: string, aPreferenceValue: any, aPage: string): Observable<string> {
    // Construct the URL for the REST endpoint  (to set the banner preference only)
    const restUrl = environment.baseUrl + '/api/preferences/page/set';

    let setPreferenceDTO: SetPreferenceDTO = new SetPreferenceDTO();
    setPreferenceDTO.name = aPreferenceName;
    setPreferenceDTO.value = JSON.stringify(aPreferenceValue);
    setPreferenceDTO.page = aPage;

    // Return an observable to this POST REST call
    // -- The 2nd {} is the empty json body sent to the REST call
    // -- The 3rd {} is the empty map of options
    return this.httpClient.post(restUrl, setPreferenceDTO, {responseType: 'text'} );
  }

}
