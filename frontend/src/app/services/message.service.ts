import { Injectable } from '@angular/core';
import {MatSnackBar} from "@angular/material/snack-bar";

@Injectable({
  providedIn: 'root'
})
export class MessageService {

  public constructor(private snackBar: MatSnackBar) { }

  public sendMessage(message: string) {
    this.snackBar.open(message, 'Done',
      {
        duration: 6000,                // Close the message after 6 sec
        verticalPosition: 'bottom',
        horizontalPosition: 'center'
      });

  }  // end of method

}

