import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Category, Payment, Store } from '../services/entities';
import { colors, Theme } from '../theme/themes';
import { StoreService } from '../services/store.service';

@Component({
  selector: 'app-store',
  templateUrl: './store.component.html',
  styleUrls: ['./store.component.css']
})
export class StoreComponent implements OnInit, OnDestroy {
  store: Store
  editedStore: Store
  loading = false;
  filepath: string;
  payments: Payment[];
  subs: Subscription[] = [];
  availableColors: any;

  constructor(
    private storeService: StoreService,
  ) { }

  ngOnInit() {
    this.store = this.storeService.getSelectedStore();
    this.subs.push(
      this.storeService.getProperties().subscribe(resp => this.payments = resp.p)
    );
    this.availableColors = colors;
  }

  focus(field: string) {
    document.getElementById(field).focus();
  }

  getAddresses() {
    return this.store.address.map(ad => ad.name).join(', ');
  }

  checkProperties(obj: Payment | Category, type: string) {
    if (type == 'payment') {
      return this.store.payments.some(p => obj.name == p.name);
    } else if (type == 'category') {
      return this.store.categories.some(c => obj.name == c.name);
    }
    return false
  }

  getColor(color: Theme, prop: string) {
    return color.properties[prop]
  }
  
  ngOnDestroy() {
    this.subs.map(s => s.unsubscribe());
  }
}
