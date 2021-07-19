import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Category, Product, Store } from '../services/entities';
import { SnackbarService } from '../services/snackbar.service';
import { StoreService } from '../services/store.service';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit, OnDestroy {
  categories: Category[];
  disabledCategories: Category[];
  products: Product[];
  disabledProducts: Product[];
  subs: Subscription[] = [];
  store: Store;
  loading: boolean;
  all: Category;

  constructor(
    private storeService: StoreService,
    private userService: UserService,
    private snackbar: SnackbarService,
  ) { }

  ngOnInit() {
    this.subs.push(
      this.storeService.getStore.subscribe(this.setStore)
    );
    if (!this.store) {
      this.init();
    }
  }

  init() {
    this.setStore(this.storeService.getSelectedStore());
  }

  setStore = (store: Store) => {
    this.loading = false;
    this.store = store;
    this.subs.push(
      this.storeService.getProperties().subscribe(this.classify),
      this.storeService.getProducts(store.code).subscribe(this.classifyProducts),
    )
  }

  classify = (resp: any) => {
    this.categories = [];
    this.disabledCategories = [];
    resp.c.forEach((cat: Category) => {
      if (cat.name == 'Todos') {
        this.all = cat;
        return;
      }
      if (this.store.categories.some(c => cat.name == c.name)) {
        this.categories.push(cat);
      } else {
        this.disabledCategories.push(cat);
      }
    })
  }

  classifyProducts = (resp: Product[]) => {
    this.products = [];
    this.disabledProducts = [];
    resp.forEach(prod => {
      if (prod.active) {
        this.products.push(prod);
      } else {
        this.disabledProducts.push(prod);
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

  sort() {
    this.categories.sort(this.sortFn);
    this.disabledCategories.sort(this.sortFn);
  }

  sortFn = (a: Category, b: Category) => a.name.toLowerCase() > b.name.toLowerCase() ? 1 : -1;

  saveChanges(field: string) {
    switch (field) {
      case 'all':
        this.loading = true;
        this.store.categories = [ this.all, ...this.categories];
        this.store.ownerUid = this.userService._user.uid;
        this.storeService.updateStore(this.store).subscribe(resp => {
          this.loading = false;
          if (resp) {
            this.snackbar.show('Dados alterados com sucesso!');
            // this.setStore(resp);
            this.storeService.setStore(resp);
          } else {
            this.snackbar.show('Ocorreu um erro ao salvar as alterações!', 'error');
          }
        });
      break;
    }
  }

  ngOnDestroy(): void {
    this.subs.forEach(s => s.unsubscribe());
  }

}
