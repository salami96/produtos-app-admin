import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { User, Store } from '../services/entities';
import { StoreService } from '../services/store.service';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit, OnDestroy {
  subs: Subscription[] = [];
  show: boolean;
  qtt = 0;
  cartTop = false;
  cartBottom = false;
  title: string;

  constructor(
    public uService: UserService,
    public sService: StoreService
  ) { }

  ngOnInit() {
    this.subs.push(
      this.uService.getUser.subscribe(this.verify),
      this.sService.getStore.subscribe(this.verify),
      this.sService.getOrders.subscribe(value => {
        if (value) {
          console.log(value);
          const newOrders = value.filter(order => order.status === 0).length;
          if (newOrders !== this.qtt) {
            this.cartTop = true;
            this.cartBottom = true;
            setTimeout(() => {
              this.cartTop = false;
              this.cartBottom = false;
            }, 1000);
            this.qtt = newOrders;
          }
        }
      })
    );
  }

  verify = (value) => {
    if (value && value.code) {
      this.title = value.code + '/gerente';
    }
    this.show = this.uService.logged && this.sService.alreadySelected;
  }

  ngOnDestroy(): void {
    this.subs.forEach(s => s.unsubscribe());
  }

}
