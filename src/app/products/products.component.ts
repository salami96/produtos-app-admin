import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Category, Product, Store } from '../services/entities';
import { StoreService } from '../services/store.service';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit, OnDestroy {
  categories: Category[] = [];
  disabledCategories: Category[] = [];
  products: Product[];
  disabledProducts: Product[];
  subs: Subscription[] = [];
  store: Store;

  constructor(
    private storeService: StoreService,
  ) { }

  ngOnInit() {
    this.subs.push(
      this.storeService.getStore.subscribe(s => this.store = s),
      this.storeService.getProperties().subscribe(this.classify)
    );
  }

  classify = (resp: any) => {
    resp.c.forEach((cat: Category) => {
      if (cat.name == 'Todos') return;
      if (this.store.categories.some(c => cat.name == c.name)) {
        this.categories.push(cat);
      } else {
        this.disabledCategories.push(cat);
      }
    })
  }

  hide(cat: any) {
    this.disabledCategories.push(
      ...this.categories.splice(this.categories.findIndex(c => c.name == cat.name), 1)
    );
    this.sort()
  }

  show(cat: any) {
    this.categories.push(
      ...this.disabledCategories.splice(this.disabledCategories.findIndex(c => c.name == cat.name), 1)
    );
    this.sort()
  }

  add() {
    this.categories.push({
      icon: '',
      name: 'Cat' + (this.categories.length + this.disabledCategories.length + 1)
    });
    this.sort()
  }

  sort() {
    this.categories.sort(this.sortFn);
    this.disabledCategories.sort(this.sortFn);
  }

  sortFn = (a: Category, b: Category) => a.name.toLowerCase() > b.name.toLowerCase() ? 1 : -1;

  ngOnDestroy(): void {
    this.subs.forEach(s => s.unsubscribe());
  }

}
