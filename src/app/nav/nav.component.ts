import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, Observer, Subscription } from 'rxjs';
import { User } from '../services/entities';
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
  user$: Observable<User>;

  constructor(
    public uService: UserService,
    public sService: StoreService
  ) { }

  ngOnInit() {
    // this.user$ = this.uService.getUser;
    this.subs.push(
      this.uService.getUser.subscribe(this.verify),
      this.sService.getStore.subscribe(this.verify)
    );
  }

  verify = (resp) => {
    this.show = this.uService.logged && this.sService.selected !== undefined;
  }

  ngOnDestroy(): void {
    this.subs.forEach(s => s.unsubscribe());
  }

}
