import { Injectable } from '@angular/core';
import { Store } from './entities';

@Injectable({
  providedIn: 'root'
})
export class StoreService {
  // store: Store;
  store: string;

  constructor() { }

}
