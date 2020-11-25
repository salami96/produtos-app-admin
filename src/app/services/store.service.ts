import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observer } from 'rxjs';
import { Store } from './entities';

@Injectable({
  providedIn: 'root'
})
export class StoreService {
  selected: Store;
  options = {
    headers: {
      'authorization': 't5b3b9a5',
      'Access-Control-Allow-Origin': '*'
    }
  };

  constructor(
    private http: HttpClient
  ) { }

  getStores(uid: string) {
    return this.http.get<Store[]>(
      `/api/stores-by-owner/${uid}`, this.options
    );
  }

  setStore(store: Store) {
    this.selected = store;
  }
}
