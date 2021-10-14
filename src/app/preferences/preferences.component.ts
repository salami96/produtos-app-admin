import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Store } from '../services/entities';
import { SnackbarService } from '../services/snackbar.service';
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
  pixActivated: boolean;
  keyTypes = ['CNPJ', 'CPF', 'Telefone', 'Chave aleatória'];
  pixKeyType: string;
  pixKey: string;
  pixQrCode: string;
  pixErrorMsg: string;
  cardBrands: string[];
  cardActivated: boolean;
  newBrand: string;
  addingBrand: boolean;

  constructor(
    private uService: UserService,
    private sService: StoreService,
    private snackbar: SnackbarService,
    private router: Router
  ) { }

  ngOnInit() {
    this.setStore(this.sService.getSelectedStore());
    this.subs.push(this.sService.getStore.subscribe(this.setStore));
  }

  setStore = (store) => {
    this.store = store;
    this.areas = this.store.shippings.map(s => {
      return {
        zipCode: `CEP: ${s.zipCode}`,
        value: `CEP: ${s.value.toLocaleString('pt-BR', this.formato)}`,
      }
    })
    this.showCompleteShippingArea(this.store.shippings);
    if (this.store.payments.some(p => p.name == 'Pix')) {
      this.pixActivated = true;
      this.pixKey = this.store.pixKey;
      this.pixKeyType = this.store.pixKeyType;
      this.pixQrCode = this.store.pixQrCode;
    }
    if (this.store.payments.some(p => p.name == 'Cartão')) {
      this.cardActivated = true;
      this.cardBrands = this.store.cardBrands;
    }
  }

  logout() {
    this.uService.logout();
    this.sService.unsetStore();
  }

  selectStore() {
    this.sService.unsetStore();
    this.router.navigate(['/escolher-loja']);
  }

  showCompleteShippingArea(shippings: any[]) {
    this.areas = [];
    shippings.forEach(shipping => {
      if (shipping.zipCode.length === 8) {
        this.sService.zipRequest(shipping.zipCode).toPromise().then((resp: any) => {
          let bairro = '';
          if (resp.bairro) {
            bairro = `${resp.bairro}, `;
          }
          this.areas.push({
            zipCode: `${bairro}${resp.localidade} - ${resp.uf}`,
            value: shipping.value.toLocaleString('pt-BR', this.formato)
          });
        }).catch( e => {
          console.log(e);
          this.areas.push({
            zipCode: `CEP: ${shipping.zipCode}`,
            value: shipping.value.toLocaleString('pt-BR', this.formato)
          });
        });
      }
    });
  }

  validatePix() {
    if (!this.keyTypes.includes(this.pixKeyType)){
      this.pixErrorMsg = 'Tipo de chave inválida!';
      return false;
    }
    switch (this.pixKeyType) {
      case 'CPF':
        if (!(/^[0-9]{11}$/).test(this.pixKey)) {
          this.pixErrorMsg = 'CPF inválido!';
          return false;
        }
        break;
      case 'CNPJ':
        if (!(/^[0-9]{14}$/).test(this.pixKey)) {
          this.pixErrorMsg = 'CNPJ inválido!';
          return false;
        }
        break;
      case 'Telefone':
        if (!(/^[0-9]{11}$/).test(this.pixKey)) {
          this.pixErrorMsg = 'Telefone inválido!';
          return false;
        }
        break;
      case 'Chave aleatória':
        if (!(/^[0-9a-z\-]{36}$/).test(this.pixKey)) {
          this.pixErrorMsg = 'Chave aleatória inválida!';
          return false;
        }
        break;
    }
    return true;
  }

  save(property: string) {
    const isNotAdmin = !this.store.ownerUid
    if (isNotAdmin) this.store.ownerUid = this.uService._user.uid;
    switch (property) {
      case 'pix':
        if (this.validatePix()) {
          this.loading[property] = true;
          this.store.pixKeyType = this.pixKeyType
          this.store.pixKey = this.pixKey
          this.sService.updateStore(this.store).toPromise().then(resp => {
            if (isNotAdmin) resp.ownerUid = null;
            this.sService.setStore(resp);
            this.loading[property] = false;
            this.snackbar.show('Dados Pix gravados com sucesso');
          }).catch(e => {
            console.log(e);
            this.snackbar.show('Houve um erro ao salvar seus dados do Pix', 'error');
            this.loading[property] = false;
          })
        } else {
          this.errors[property] = true;
        }
        break;
      case 'delete-pix':
        this.loading['pix'] = true;
        this.store.pixKeyType = '';
        this.pixKeyType = '';
        this.store.pixKey = '';
        this.pixKey = '';
        this.sService.updateStore(this.store).toPromise().then(resp => {
          if (isNotAdmin) resp.ownerUid = null;
          this.sService.setStore(resp);
          this.loading['pix'] = false;
          this.snackbar.show('Dados Pix excluídos com sucesso');
        }).catch(e => {
          console.log(e);
          this.snackbar.show('Houve um erro ao excluir seus dados do Pix', 'error');
          this.loading['pix'] = false;
        })
        break;
      case 'brand':
        if (this.newBrand) {
          this.loading[property] = true;
          this.cardBrands.push(this.newBrand);
          this.newBrand = '';
          this.addingBrand = false;
          this.store.cardBrands = this.cardBrands;
          this.sService.updateStore(this.store).toPromise().then(resp => {
            if (isNotAdmin) resp.ownerUid = null;
            this.sService.setStore(resp);
            this.loading[property] = false;
            this.snackbar.show('Nova bandeira de cartão adicionada com sucesso com sucesso');
          }).catch(e => {
            console.log(e);
            this.snackbar.show('Houve um erro ao adicionar a nova bandeira', 'error');
            this.loading[property] = false;
          })
        } else {
          this.errors[property] = true;
        }
        break;
      case 'delete-pix':
        this.loading['pix'] = true;
        this.store.pixKeyType = '';
        this.pixKeyType = '';
        this.store.pixKey = '';
        this.pixKey = '';
        this.sService.updateStore(this.store).toPromise().then(resp => {
          if (isNotAdmin) resp.ownerUid = null;
          this.store = resp;
          this.sService.setStore(resp);
          this.loading['pix'] = false;
          this.snackbar.show('Dados Pix excluídos com sucesso');
        }).catch(e => {
          console.log(e);
          this.snackbar.show('Houve um erro ao excluir seus dados do Pix', 'error');
          this.loading['pix'] = false;
        })
        break;
    }
  }

  ngOnDestroy(): void {
    this.subs.forEach(s => s.unsubscribe());
  }
}
