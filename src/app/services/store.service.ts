import { Injectable } from '@angular/core';
import { Observable, Observer } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StoreService {
  private store: Observer<string>;
  alreadySelected = false;

  constructor() { }

  getStore = new Observable<string>((observer) => {
    observer.next();
    this.store = observer;
  });

  setStore(text: string) {
    this.alreadySelected = text !== undefined;
    this.store.next(text);
  }
}
