import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Address, Category, Payment, Store } from '../services/entities';
import { colors, Theme } from '../theme/themes';
import { StoreService } from '../services/store.service';
import { SnackbarService } from '../services/snackbar.service';
import { Router } from '@angular/router';

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
  selectedAddress: Address;
  reference: boolean;
  complement: boolean;
  loadingZipCode: boolean;
  previewCount = 0;
  valid: boolean;

  constructor(
    private storeService: StoreService,
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

  addAddress() {
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

  getColor(color: Theme, prop: string) {
    return color.properties[prop]
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
    if (!this.editedStore.fb) {
      this.setError('fb');
    }
    if (!this.editedStore.insta || this.editedStore.insta[0] != '@') {
      this.setError('insta');
    }
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

  setError(id: string) {
    this.errors[id] = true;
    this.valid = false;
  }
  
  saveChanges(field: string) {
    switch (field) {
      case 'preview':
        if (this.validate()) {
          this.previewCount++;
          this.router.navigate([' /loja/preview' ]);
        }
      break;
      case 'all':
        if (this.validate()) {
          this.loading = true;
        }
      break;
      case 'logo':
        if (this.preview && this.file.type.includes('image')) {
          this.store.logo = this.preview
          this.storeService.updateStoreLogo(this.store.code, this.preview).subscribe(resp => {
            this.editedStore.logo = resp;
            this.snackbar.show('Logotipo alterado com sucesso!');
            document.getElementById('logo-success').click();
          });
          this.errors[field] = false;
        } else {
          this.errors[field] = true;
        }
      break;
      case 'address':
        if (this.preview && this.file.type.includes('image')) {
          this.storeService.updateStoreLogo(this.store.code, this.preview).subscribe(resp => {
            this.snackbar.show('Endereços atualizados com sucesso!');
            document.getElementById('address-success').click();
          });
          this.errors[field] = false;
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
