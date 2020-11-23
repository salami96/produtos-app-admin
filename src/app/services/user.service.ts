import { Injectable } from '@angular/core';
import { Observable, Observer } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private user: Observer<string>;
  logged = false;

  constructor() { }

  getUser = new Observable<string>((observer) => {
    observer.next();
    this.user = observer;
  });

  setUser(text: string) {
    this.logged = text !== undefined;
    this.user.next(text);
  }
}
