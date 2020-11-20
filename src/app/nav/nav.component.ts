import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { StoreService } from '../services/store.service';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {
  store$: Observable<string>;
  user$: Observable<string>;

  constructor(
    private uService: UserService,
    private sService: StoreService
  ) { }

  ngOnInit() {
    this.store$ = this.sService.getStore;
    this.user$ = this.uService.getUser;
  }

}
