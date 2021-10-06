import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Address, Category, Order, Payment, Product, Store } from './entities';
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
    private snackbar: SnackbarService,
  ) { }

  getStoresApi(uid: string) {
    return this.http.get<Store[]>(
      `${environment.host}/api/stores-by-owner/${uid}`, this.options
    );
  }

  refreshStore(code: string) {
    this.http.get<Store>(
      `${environment.host}/api/store/${code}`, this.options
    ).subscribe(this.setStore);
  }

  getStoreCodes() {
    return this.http.get<string[]>(
      `${environment.host}/api/available-codes/`, this.options
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

  getProducts(code: string) {
    return this.http.get<Product[]>(
      `${environment.host}/api/products/${code}?all=true`, this.options
    );
  }

  createStore(store: Store) {
    return this.http.post<Store>(
      `${environment.host}/api/store`, store, this.options
    );
  }

  updateStore(store: Store) {
    return this.http.put<Store>(
      `${environment.host}/api/store`, store, this.options
    );
  }

  addAddress(address: Address) {
    return this.http.post<Address>(
      `${environment.host}/api/store/address`, { address }, this.options
    );
  }

  updateAddress(address: Address) {
    return this.http.put<Address>(
      `${environment.host}/api/store/address`, { address }, this.options
    );
  }

  uploadLogo(file: Blob, code: string) {
    const data = new FormData();
    data.append('logo', file);
    data.append('code', code);
    return this.http.put<any>(
      `${environment.host}/api/store-logo`, data, this.options
    );
  }

  updateProduct(product: Product, uid: string) {
    return this.http.put<Product>(
      `${environment.host}/api/product/`, { uid, product }, this.options
    );
  }

  uploadPhotos(files: Blob[], cod: string) {
    const data = new FormData();
    files.forEach(f => {
      data.append('productImages', f);
    });
    data.append('cod', cod);
    return this.http.post<any>(
      `${environment.host}/api/product-images/`, data, this.options
    );
  }

  createProduct(files: Blob[], product: Product, uid: string) {
    const data = new FormData();
    files.forEach(f => {
      data.append('productImages', f);
    });
    data.append('uid', uid);
    data.append('product', `${JSON.stringify(product)}`);
    return this.http.post<Product>(
      `${environment.host}/api/product/`, data, this.options
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

  public zipRequest(zipCode: string) {
    return this.http.get(`https://viacep.com.br/ws/${zipCode}/json/`);
  }

  setStore = (store: Store) => {
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
