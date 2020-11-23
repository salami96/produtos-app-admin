import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { StoreService } from '../services/store.service';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-preferences',
  templateUrl: './preferences.component.html',
  styleUrls: ['./preferences.component.css']
})
export class PreferencesComponent implements OnInit {

  constructor(
    private uService: UserService,
    private sService: StoreService,
    private router: Router
  ) { }

  ngOnInit() {
  }

  logout() {
    this.uService.setUser(undefined);
    this.sService.setStore(undefined);
    this.router.navigate([ '/entrar' ]);
  }

  selectStore() {
    this.sService.setStore(undefined);
    this.router.navigate([ '/escolher-loja' ]);
  }

}
