import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { StoreService } from '../services/store.service';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-choose-store',
  templateUrl: './choose-store.component.html',
  styleUrls: ['./choose-store.component.css']
})
export class ChooseStoreComponent implements OnInit {
  user$: Observable<string>;
  store$: Observable<string>;

  constructor(
    private uService: UserService,
    private sService: StoreService,
    private router: Router
  ) { }

  ngOnInit() {
    this.user$ = this.uService.getUser.pipe();
    this.store$ = this.sService.getStore;
    if (!this.uService.logged) {
      this.router.navigate([ '/entrar' ]);
    }
  }

  setStore(text: string) {
    this.sService.setStore(text);
    this.router.navigate([ '/pedidos' ]);
  }
}
