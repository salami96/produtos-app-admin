import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { StoreService } from './services/store.service';
import { UserService } from './services/user.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Gerente produtos.app';

  constructor(
    private uService: UserService,
    private sService: StoreService
  ) {
    uService.getUser.subscribe();
    sService.getStore.subscribe();
  }
}
