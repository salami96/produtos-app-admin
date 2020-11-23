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

  login(email: string, pass: string): Promise<any> {
    return;
  }

  save(name: string, phone: string, email: string, pass: string): Promise<any> {
    return;
  }

  providerLogin(method: string): Promise<any> {
    return;
  }

  resetPassword(email: string): Promise<any> {
    return;
  }
}
