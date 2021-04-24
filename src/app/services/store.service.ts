import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Order, Store } from './entities';

@Injectable({
  providedIn: 'root'
})
export class StoreService {
  selected = new Subject<Store>();
  getStore = this.selected.asObservable();
  orders = new Subject<Order[]>();
  getOrders = this.orders.asObservable();
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

  getStoresApi(uid: string) {
    return this.http.get<Store[]>(
      // `http://localhost:9000/api/stores-by-owner/${uid}`, this.options
      `http://192.168.1.104:9000/api/stores/`, this.options
    );
  }
  getOrdersApi(code: string) {
    this.http.get<Order[]>(
      `http://192.168.1.104:9000/api/orders/${code}`, this.options
    ).subscribe(resp => this.orders.next(resp));
  }

  setStore(store: Store) {
    this.alreadySelected = true;
    this.selected.next(store);
    this.getOrdersApi((store as any)._id);
  }

  unsetStore() {
    this.alreadySelected = false;
    this.selected.next(undefined);
  }
}
