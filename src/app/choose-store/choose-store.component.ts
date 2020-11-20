import { Component, OnInit } from '@angular/core';
import { StoreService } from '../services/store.service';

@Component({
  selector: 'app-choose-store',
  templateUrl: './choose-store.component.html',
  styleUrls: ['./choose-store.component.css']
})
export class ChooseStoreComponent implements OnInit {

  constructor(
    private sService: StoreService
  ) { }

  ngOnInit() {
  }

  setStore(text: string) {
    this.sService.setStore(text);
  }
}
