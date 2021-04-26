import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Address, Order, Store } from '../services/entities';
import { SnackbarService } from '../services/snackbar.service';
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
  innerWidth: number;
  query: string;
  filtering = false;

  constructor(
    private sService: StoreService,
    private snackbar: SnackbarService
  ) { }

  ngOnInit() {
    this.isActive = 'todos';
    this.store = this.sService.getSelectedStore();
    this.classify(this.sService.getLocalOrders());
    this.subs.push(
      this.sService.getStore.subscribe(resp => this.store = resp),
      this.sService.getOrders.subscribe(this.classify)
    );
    this.innerWidth = window.innerWidth;
    window.onresize = () => {
      this.innerWidth = window.innerWidth;
    };
  }

  setCategory(cat: string) {
    this.isActive = cat;
  }

  classify = (orders: Order[]) => {
    this.status.forEach(f => {
      this.qtt[f] = 0;
      this.orders[f] = [];
    });
    this.qtt['todos'] = 0;
    if (orders && orders.length > 0) {
      this.hasOrders = true;
      this.qtt['todos'] = orders.length;
      this.orders['todos'] = orders;
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

  search() {
    this.clearFilters(false);
    if (this.query) {
      this.filtering = true;
      this.classify(this.orders['todos'].filter((o: Order) => 
        o.client.name.toLowerCase().includes(this.query) || o.cod == Number.parseInt(this.query)
      ))
    } else {
      this.snackbar.show('Por favor, preencha o campo de pesquisa!', 'error')
    }
  }

  clearFilters(toDelete = true) {
    this.filtering = false;
    this.classify(this.sService.getLocalOrders());
    if (toDelete) {
      this.query = '';
      this.showSearchBar = false;
    }
    this.isActive = 'todos';
  }

  setFocus() {
    this.showSearchBar = true;
    setTimeout(() => {
      document.getElementById("search-mobile").focus();
    }, 0);
  }

  ngOnDestroy(): void {
    this.subs.forEach(s => s.unsubscribe());
  }
}
