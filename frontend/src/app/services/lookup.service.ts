import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {Observable} from "rxjs";
import {LookupDTO} from "../models/lookup-dto";

@Injectable({
  providedIn: 'root'
})
export class LookupService {

  constructor(private httpClient: HttpClient) { }

  /*
   * Return a list of LookupDTO objects that correspond to the passed-in type name -- e.g, 'priority'
   */
  public getLookupWithType(aType: string): Observable<LookupDTO[]>  {

    const restUrl = environment.baseUrl + '/api/lookups/' + aType;

    return this.httpClient.get <LookupDTO[]>(restUrl);
  }
}
