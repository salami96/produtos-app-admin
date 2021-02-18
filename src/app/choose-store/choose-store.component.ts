import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Store, User } from '../services/entities';
import { StoreService } from '../services/store.service';
import { UserService } from '../services/user.service';

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
    }
    this.uService.getUser.subscribe(user => {
      if (user) {
        this.user = user;
        this.stores$ = this.sService.getStores(user.uid);
      }
    });
  }

  setStore(store: Store) {
    this.sService.setStore(store);
    this.router.navigate([ '/pedidos' ]);
  }
}
