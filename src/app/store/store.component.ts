import { Component, OnInit } from '@angular/core';
import { Store } from '../services/entities';
import { StoreService } from '../services/store.service';

@Component({
  selector: 'app-store',
  templateUrl: './store.component.html',
  styleUrls: ['./store.component.css']
})
export class StoreComponent implements OnInit {
  store: Store
  loading = false;
  filepath: string;

  constructor(
    private storeService: StoreService,
  ) { }

  ngOnInit() {
    this.store = this.storeService.getSelectedStore();
  }

  focus(field: string) {
    document.getElementById(field).focus();
  }

  getAddresses() {
    return this.store.address.map(ad => ad.name).join(', ');
  }

}
