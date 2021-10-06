import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SnackbarService {
  snackbarSubject = new Subject<any>();
  snackbarState = this.snackbarSubject.asObservable();

  constructor() { }

  show(message: string, type?: string, action?: string) {
    this.snackbarSubject.next({
      message,
      type,
      action
    });
  }
}
