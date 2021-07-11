import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { Store, User } from '../services/entities';
import { StoreService } from '../services/store.service';
import { UserService } from '../services/user.service';
import { colors, Theme } from '../theme/themes';

@Component({
  selector: 'app-choose-store',
  templateUrl: './choose-store.component.html',
  styleUrls: ['./choose-store.component.css']
})
export class ChooseStoreComponent implements OnInit {
  user: User;
  stores$: Observable<Store[]>;

  constructor(
    private uService: UserService,
    private sService: StoreService,
    private router: Router
  ) { }

  ngOnInit() {
    if (!this.uService.logged) {
      this.router.navigate([ '/entrar' ]);
    } else {
      const selected = this.sService.getSelectedStore();
      if (selected) {
        this.setStore(selected);
      } else {
        const user = this.uService._user;
        this.stores$ = this.sService.getStoresApi(user.uid);
      }
    }
  }

  getColor(color: string, prop: string) {
    return colors.find(c => c.name == color).properties[prop];
  }

  setStore(store: Store) {
    this.sService.setStore(store);
    this.router.navigate([ '/pedidos' ]);
  }
}
