import { Injectable } from '@angular/core';
import {LookupDTO} from "../models/lookup-dto";

@Injectable({
  providedIn: 'root'
})
export class LookupService {

  constructor() { }

  /*
   * Return a list of LookupDTO objects that correspond to the passed-in type name -- e.g, 'priority'
   */
  public getLookupWithType(aType: string): LookupDTO[]  {

    // Return a hard-coded array of LookupDTO objects
    let listOfDtos: LookupDTO[];

    listOfDtos = [
      {
        id: 1,
        name: 'Low (from lookup.service.ts)'
      },
      {
        id: 2,
        name: 'Medium'
      },
      {
        id: 3,
        name: 'High'
      },
      {
        id: 4,
        name: 'Critical'
      }];

    return listOfDtos;
  }
}
