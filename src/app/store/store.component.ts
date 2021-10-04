import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Address, Payment, Store } from '../services/entities';
import { colors, Theme } from '../theme/themes';
import { StoreService } from '../services/store.service';
import { SnackbarService } from '../services/snackbar.service';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-store',
  templateUrl: './store.component.html',
  styleUrls: ['./store.component.css']
})
export class StoreComponent implements OnInit, OnDestroy {
  store: Store
  editedStore: Store
  loading = false;
  file: Blob;
  payments: Payment[];
  subs: Subscription[] = [];
  availableColors: any;
  errors: boolean[] = [];
  preview: string;
  isNewAddress: boolean;
  selectedAddress: Address;
  reference: boolean;
  complement: boolean;
  loadingZipCode: boolean;
  valid: boolean;

  constructor(
    private storeService: StoreService,
    private userService: UserService,
    private snackbar: SnackbarService,
    private router: Router,
  ) { }

  ngOnInit() {
    this.store = this.storeService.getSelectedStore();
    this.editedStore = this.storeService.getSelectedStore();
    this.subs.push(
      this.storeService.getProperties().subscribe(resp => this.payments = resp.p)
    );
    this.availableColors = colors;
    this.addAddress();
  }

  focus(field: string) {
    document.getElementById(field).focus();
  }

  checkPay = (pay: Payment) => {
    return this.editedStore.payments.find(p => p.name == pay.name);
  }

  setPayment(pay: Payment) {
    if (this.checkPay(pay)) {
      this.editedStore.payments.forEach((p, i) => {
        if (p.name == pay.name) {
          this.editedStore.payments.splice(i, 1)
        }
      });
    } else {
      this.editedStore.payments.push(pay);
    }
  }

  rmAddress(ad: string) {
    this.editedStore.address.forEach((a, i) => {
      if (a.name == ad) {
        this.editedStore.address.splice(i, 1)
      }
    });
  }

  setAddress(ad: Address) {
    this.selectedAddress = ad;
    this.isNewAddress = false;
    this.complement = ad.complement != '';
    this.reference = ad.reference != '';
  }

  addAddress() {
    this.isNewAddress = true;
    this.selectedAddress = {
      _id: '',
      name: '',
      street: '',
      number: '',
      district: '',
      city: '',
      state: '',
      zipCode: '',
      complement: '',
      reference: ''
    };
    this.complement = false;
    this.reference = false;
  }

  zipCodeApi() {
    const aux = this.selectedAddress.zipCode;
    if (aux.length === 8) {
      this.loadingZipCode = true;
      this.subs.push(
        this.storeService.zipRequest(aux).subscribe((resp: any) => {
          this.loadingZipCode = false;
          this.selectedAddress.city = resp.localidade;
          this.selectedAddress.state = resp.uf;
          if (resp.logradouro) {
            this.selectedAddress.street = resp.logradouro;
          }
          if (resp.bairro) {
            this.selectedAddress.district = resp.bairro;
          }
        }, error => console.log(error))
      );
      this.errors['zipCode'] = false;
    } else {
      this.errors['zipCode'] = true;
    }
  }

  getColor(color: Theme, prop: string) {
    return color.properties[prop];
  }

  validate() {
    this.valid = true;
    this.errors = [];
    if (!this.editedStore.title) {
      this.setError('title');
    }
    if (!this.editedStore.slogan) {
      this.setError('slogan');
    }
    if (!this.editedStore.phone) {
      this.setError('phone');
    }
    if (!this.editedStore.whatsapp) {
      this.setError('whatsapp');
    }
    // if (!this.editedStore.fb) {
    //   this.setError('fb');
    // }
    // if (!this.editedStore.insta || this.editedStore.insta[0] != '@' || this.editedStore.insta.includes('/')) {
    //   this.setError('insta');
    // }
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (!re.test(String(this.editedStore.email).toLowerCase())) {
      this.setError('email');
    }
    if (this.editedStore.address.length == 0) {
      this.setError('address');
    }
    if (this.editedStore.payments.length == 0) {
      this.setError('payments');
    }
    if (!this.valid) {
      this.snackbar.show('Verifique o preenchimento dos dados acima', 'error')
    }
    return this.valid;
  }

  validateAddress() {
    this.valid = true;
    this.errors = [];
    if (!this.selectedAddress.zipCode) {
      this.setError('zipCode');
    }
    if (!this.selectedAddress.street) {
      this.setError('street');
    }
    if (!this.selectedAddress.number) {
      this.setError('number');
    }
    if (!this.selectedAddress.district) {
      this.setError('district');
    }
    if (!this.selectedAddress.city) {
      this.setError('city');
    }
    if (!this.selectedAddress.state) {
      this.setError('state');
    }
    if (!this.selectedAddress.name) {
      this.setError('name');
    }
    if (!this.valid) {
      this.snackbar.show('Verifique o preenchimento dos dados acima', 'error')
    }
    return this.valid;
  }

  setError(id: string) {
    this.errors[id] = true;
    this.valid = false;
  }

  saveChanges(field: string) {
    switch (field) {
      case 'preview':
        if (this.validate()) {
          localStorage['preview'] = JSON.stringify(this.editedStore);
          this.snackbar.show('Pré visualização gerada com sucesso!');
          this.router.navigate([ 'loja/preview' ]);
        }
      break;
      case 'all':
        if (this.validate()) {
          this.loading = true;
          const isNotAdmin = !this.editedStore.ownerUid
          if (isNotAdmin) this.editedStore.ownerUid = this.userService._user.uid;
          this.storeService.updateStore(this.editedStore).subscribe(resp => {
            this.loading = false;
            if (resp) {
              if (isNotAdmin) resp.ownerUid = null;
              this.storeService.setStore(resp);
              this.editedStore = resp;
              this.store = resp;
              this.snackbar.show('Dados editados com sucesso!');
            } else {
              this.snackbar.show('Ocorreu um erro ao salvar as alterações!', 'error');
            }
          });
        }
      break;
      case 'logo':
        if (this.preview && this.file.type.includes('image')) {
          this.storeService.uploadLogo(this.file, this.store.code).subscribe(resp => {
            if (resp.status) {
              this.editedStore.logo = resp.url;
              this.store = this.editedStore;
              this.storeService.setStore(this.editedStore);
              this.snackbar.show('Logotipo alterado com sucesso!');
            } else {
              this.snackbar.show('Falha ao enviar a imagem!', 'error');
            }
            document.getElementById('logo-success').click();
          }, e => {
            console.log(e);
            this.snackbar.show('Falha ao enviar a imagem!', 'error');
          });
        } else {
          this.errors[field] = true;
        }
      break;
      case 'new-address':
        if (this.validateAddress()) {
          delete this.selectedAddress._id;
          this.storeService.addAddress(this.selectedAddress).subscribe(resp => {
            if (resp) {
              this.errors[field] = false;
              this.editedStore.address.push(resp);
              document.getElementById('address-success').click();
              this.snackbar.show('Endereços atualizados com sucesso!');
            } else {
              this.errors[field] = true;
            }
          });
        } else {
          this.errors[field] = true;
        }
      break;
      case 'address':
        if (this.validateAddress()) {
          this.storeService.updateAddress(this.selectedAddress).subscribe(resp => {
            if (resp) {
              this.errors[field] = false;
              this.editedStore.address.forEach(ad => {
                if (ad._id == resp._id) {
                  ad = resp;
                }
              });
              document.getElementById('address-success').click();
              this.snackbar.show('Endereços atualizados com sucesso!');
            } else {
              this.errors[field] = true;
            }
          });
        } else {
          this.errors[field] = true;
        }
      break;
    }
  }

  readFile(e: any) {
    this.errors['logo'] = false;
    this.preview = ''
    this.file = (e.target as HTMLInputElement).files[0];

    if (this.file && this.file.type.includes('image')) {
      const reader = new FileReader();
      reader.onload = () => {
        this.preview = reader.result as string;
      }
      reader.readAsDataURL(this.file)
    } else {
      this.errors['logo'] = true;
    }
  }

  ngOnDestroy() {
    this.subs.map(s => s.unsubscribe());
  }
}
