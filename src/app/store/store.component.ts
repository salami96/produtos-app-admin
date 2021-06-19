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
  errors: boolean[]
  logo: any;

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
  
  saveChanges(field: string) {
    switch (field) {
      case 'name':
        // if (this.name && this.user.name !== this.name) {
        //   this.user.name = this.name;
        //   this.uService.editUser(this.user).then(() => this.success(field));
        // } else {
        //   this.error[field] = true;
        // }
      break;
      case 'logo':
        // if (this.logo) {
        //   this.storeService.editLogo(document.forms.item(0)).then(resp => {
        //     resp.subscribe(store => {
        //       this.store = store;
        //       this.snackbar.show(field + 'Alterado com sucesso!');
        //     });
        //   });
        // } else {
        //   this.errors[field] = true;
        // }
      break;
    }
  }

  ngOnDestroy() {
    this.subs.map(s => s.unsubscribe());
  }
}
