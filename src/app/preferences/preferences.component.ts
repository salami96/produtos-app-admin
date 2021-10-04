import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Store } from '../services/entities';
import { StoreService } from '../services/store.service';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-preferences',
  templateUrl: './preferences.component.html',
  styleUrls: ['./preferences.component.css']
})
export class PreferencesComponent implements OnInit, OnDestroy {
  formato = { minimumFractionDigits: 2 , style: 'currency', currency: 'BRL' }
  store: Store;
  loading: boolean[] = [];
  errors: boolean[] = [];
  subs: Subscription[] = [];
  areas: any[];

  constructor(
    private uService: UserService,
    private sService: StoreService,
    private router: Router
  ) { }

  ngOnInit() {
    this.store = this.sService.getSelectedStore();
    this.zipCodeApi(this.store.shippings);
  }

  logout() {
    this.uService.logout();
    this.sService.unsetStore();
  }

  selectStore() {
    this.sService.unsetStore();
    this.router.navigate(['/escolher-loja']);
  }

  zipCodeApi(shippings: any[]) {
    this.areas = [];
    shippings.forEach(shipping => {

      this.areas.push([
        `CEP: ${shipping.zipCode}`,
        shipping.value.toLocaleString('pt-BR', this.formato)
      ]);
      return;

      if (shipping.zipCode.length === 8) {
        this.sService.zipRequest(shipping.zipCode).toPromise().then((resp: any) => {
          if (resp.bairro) {
            this.areas.push([
              `${resp.bairro}, ${resp.localidade} - ${resp.uf}`,
              shipping.value.toLocaleString('pt-BR', this.formato)
            ]);
          }
        }).catch( e => {
          console.log(e);
          this.areas.push([
            shipping.zipCode,
            shipping.value.toLocaleString('pt-BR', this.formato)
          ]);
        });
      }
    });
  }

  ngOnDestroy(): void {
    this.subs.forEach(s => s.unsubscribe());
  }
}
