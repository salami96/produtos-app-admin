import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
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
      'authorization': environment.secret,
      'Access-Control-Allow-Origin': '*'
    }
  };

  constructor(
    private http: HttpClient
  ) { }

  getStoresApi(uid: string) {
    return this.http.get<Store[]>(
      // `${environment.host}/api/stores-by-owner/${uid}`, this.options
      `${environment.host}/api/stores/`, this.options
    );
  }

  getOrdersApi(code: string) {
    this.http.get<Order[]>(
      `${environment.host}/api/orders/${code}`, this.options
    ).subscribe(this.setOrders);
  }

  setStore(store: Store) {
    localStorage['store'] = JSON.stringify(store);
    this.alreadySelected = true;
    this.selected.next(store);
    this.getOrdersApi((store as any)._id);
  }

  unsetStore() {
    localStorage.removeItem('store');
    localStorage.removeItem('orders');
    this.alreadySelected = false;
    this.selected.next(undefined);
  }

  setOrders = (list: Order[]) => {
    localStorage['orders'] = JSON.stringify(list);
    this.orders.next(list);
  }

  getLocalOrders() {
    if (localStorage['orders']) {
      return JSON.parse(localStorage['orders']);
    }
    return [];
  }

  getSelectedStore() {
    if (localStorage['store']) {
      return JSON.parse(localStorage['store']);
    }
    return null;
  }

}
