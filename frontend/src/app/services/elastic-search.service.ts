import { Injectable } from '@angular/core';
import {Observable, of} from "rxjs";
import {AutoCompleteMatchDTO} from "../models/auto-complete-match-dto";
import {AutoCompleteDTO} from "../models/auto-complete-dto";
import {environment} from "../../environments/environment";
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class ElasticSearchService {

  constructor(private httpClient: HttpClient) { }


  public runSearch(aRawQuery: string, aTotalReturnsToReturn: number): Observable<AutoCompleteMatchDTO[]> {
    if (aRawQuery == '') {
      // The search box is empty so return an empty list (and do not run a search)
      return of( [] );
    }


    // Construct the DTO that has the information this REST call needs
    let autoCompleteDTO: AutoCompleteDTO = {
      index_name: "reports",
      returned_field: "display_name",
      searched_field: "display_name.filtered",
      raw_query: aRawQuery,
      size: aTotalReturnsToReturn
    };

    // Construct the URL of the REST endpoint for the autocomplete search
    const restUrl = environment.baseUrl + '/api/search/autocomplete';

    // Return an observable (that runs an auto-complete search)
    return this.httpClient.post <AutoCompleteMatchDTO[]> (restUrl, autoCompleteDTO);

  }  // end of runSearch()

}
