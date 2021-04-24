import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { Address, Order, Store } from '../services/entities';
import { StoreService } from '../services/store.service';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css']
})
export class OrdersComponent implements OnInit, OnDestroy {
  subs: Subscription[] = [];
  store: Store;
  showSearchBar = false;
  orders: Order[][] = [];
  // expanded: boolean[] = [];
  qtt: number[] = [];
  status = ['novos', 'preparando', 'entregando', 'pronto para retirar', 'entregues', 'cancelados'];
  isActive: string;
  hasOrders = true;
  constructor(
    private sService: StoreService
  ) { }

  ngOnInit() {
    this.isActive = 'todos';
    this.subs.push(
      this.sService.getOrders.subscribe(this.classify),
      this.sService.getStore.subscribe(resp => console.log(resp))
    );
  }

  ngOnDestroy(): void {
    this.subs.forEach(s => s.unsubscribe());
  }

  setCategory(cat: string) {
    this.isActive = cat;
  }

  /* expand(f: string) {
    if (this.expanded[f]) {
      this.expanded[f] = false;
      return;
    }

    this.status.forEach(field => this.expanded[field] = field === f);
  } */

  classify = (orders: Order[]) => {
    if (orders && orders.length > 0) {
      this.qtt['todos'] = orders.length;
      this.orders['todos'] = orders;
      this.status.forEach(f => {
        this.qtt[f] = 0;
        this.orders[f] = [];
      });
      orders.forEach(o => {
        this.qtt[this.status[o.status]]++;
        this.orders[this.status[o.status]].push(o);
      });
    } else {
      this.hasOrders = false;
    }
  }

  formatAddress(ad: Address) {
    return `${ad.name}: ${ad.street}, ${ad.number}, ${ad.district}, ${ad.city} - ${ad.state}`;
  }

}
