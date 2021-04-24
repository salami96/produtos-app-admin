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
    this.uService.logout();
    this.sService.unsetStore();
  }

  selectStore() {
    this.sService.unsetStore();
    this.uService.refresh();
    this.router.navigate([ '/escolher-loja' ]);
  }

}
