import { Component, OnInit } from '@angular/core';
import { StoreService } from '../services/store.service';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  constructor(
    private uService: UserService,
    private sService: StoreService
  ) { }

  ngOnInit() {
  }

  setUser() {
    this.uService.setUser('Gabriel');
  }
}
