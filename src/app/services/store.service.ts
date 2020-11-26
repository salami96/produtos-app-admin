import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Observer } from 'rxjs';
import { Store } from './entities';

@Injectable({
  providedIn: 'root'
})
export class StoreService {
  selected: Observer<Store>;
  options = {
    headers: {
      'authorization': 't5b3b9a5',
      'Access-Control-Allow-Origin': '*'
    }
  };

  constructor(
    private http: HttpClient
  ) { }

  getStore = new Observable<Store>((observer) => {
    observer.next();
    this.selected = observer;
  });

  getStores(uid: string) {
    return this.http.get<Store[]>(
      `http://localhost:9000/api/stores-by-owner/${uid}`, this.options
    );
  }

  setStore(store: Store) {
    this.selected.next(store);
  }
}
