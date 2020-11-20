import { Injectable } from '@angular/core';
import { Observable, Observer } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StoreService {
  private store: Observer<string>;

  constructor() { }

  getStore = new Observable<string>((observer) => {
    observer.next();
    this.store = observer;
  });

  setStore(text: string) {
    this.store.next(text);
  }
}
