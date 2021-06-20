import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Category, Order, Payment, Store } from './entities';
import { SnackbarService } from './snackbar.service';

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
    private http: HttpClient,
    private snackbar: SnackbarService
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
  
  getProperties() {
    return this.http.get<{ p: Payment[]; c: Category[] }>(
      `${environment.host}/api/properties`, this.options
    );
  }
  
  updateStore(store: Store) {
    return this.http.put<Store>(
      `${environment.host}/api/store`, store, this.options
    );
  }

  updateStoreLogo(code: string, base64: string) {
    return this.http.post<string>(
      `${environment.host}/api/store-logo`, { code, base64 }, this.options
    );
  }

  async setOrderStatus(cod: string, status: number, fn: (order: Order) => void) {
    this.http.put<Order>(
      `${environment.host}/api/order/`, { cod, status }, this.options
    ).subscribe(resp => {
      if (resp) {
        const localOrders = this.getLocalOrders()
        const arr = localOrders.map(o => {
          if (o._id == cod) {
            o = resp;
          }
          return o;
        });
        this.setOrders(arr);
        fn(resp);
        this.snackbar.show("Status do pedido alterado com sucesso!");
      }
    });
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

  getLocalOrders(): Order[] {
    if (localStorage['orders']) {
      return JSON.parse(localStorage['orders']);
    }
    return [];
  }

  getOrder(id: number) {
    if (localStorage['orders']) {
      return JSON.parse(localStorage['orders']).find(o => o.cod == id);
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
