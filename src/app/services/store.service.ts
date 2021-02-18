import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Observer } from 'rxjs';
import { Order, Store } from './entities';

@Injectable({
  providedIn: 'root'
})
export class StoreService {
  selected: Observer<Store>;
  private _selected: Store;
  orders: Observer<Order[]>;
  alreadySelected = false;
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
    observer.next(this._selected);
    this.selected = observer;
  });

  getOrders = new Observable<Order[]>((observer) => {
    observer.next(undefined);
    this.orders = observer;
  });

  getStores(uid: string) {
    return this.http.get<Store[]>(
      // `http://localhost:9000/api/stores-by-owner/${uid}`, this.options
      `http://localhost:9000/api/stores/`, this.options
    );
  }
  getOrdersApi(code: string) {
    this.http.get<Order[]>(
      `http://localhost:9000/api/orders/${code}`, this.options
    ).subscribe(resp => this.orders.next(resp));
  }

  setStore(store: Store) {
    this._selected = store;
    this.alreadySelected = true;
    this.selected.next(store);
    this.getOrdersApi((store as any)._id);
  }

  unsetStore() {
    this._selected = undefined;
    this.alreadySelected = false;
    this.selected.next(undefined);
  }
}
