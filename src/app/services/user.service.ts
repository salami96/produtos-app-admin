import { Injectable } from '@angular/core';
import { Observable, Observer } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private user: Observer<string>;

  constructor() { }

  getUser = new Observable<string>((observer) => {
    observer.next();
    this.user = observer;
  });

  setUser(text: string) {
    this.user.next(text);
  }
}
