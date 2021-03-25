import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ReportService {

  constructor() { }

  /*
   * showMessage()  Demonstrate Sharing Code
   */
  public showMessage(aMessage: string): void {
    console.log('Here is the message: ' + aMessage);
  }


}
