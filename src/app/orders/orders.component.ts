import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Order, Store } from '../services/entities';
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
  orders: Order[] = [];
  expanded: boolean[] = [];
  qtt: number[] = [];
  status = ['novos', 'em preparo', 'em rota', 'entregues', 'cancelados'];

  constructor(
    private sService: StoreService
  ) { }

  ngOnInit() {
    this.expand('novos');
    this.subs.push(
      this.sService.getOrders.subscribe(this.classify),
      this.sService.getStore.subscribe(resp => this.store = resp)
    );
  }

  ngOnDestroy(): void {
    this.subs.forEach(s => s.unsubscribe());
  }

  expand(f: string) {
    if (this.expanded[f]) {
      this.expanded[f] = false;
      return;
    }

    this.status.forEach(field => this.expanded[field] = field === f);
  }

  classify = (orders: Order[]) => {
    this.status.forEach(f => this.qtt[f] = 0);
    orders.forEach(o => {
      this.qtt[this.status[o.status]]++;
      this.orders[this.status[o.status]].push(o);
    });
  }

}
