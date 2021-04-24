import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { OrdersComponent } from './orders/orders.component';
import { OrderDetailComponent } from './orders/order-detail/order-detail.component';
import { StoreComponent } from './store/store.component';
import { PreviewComponent } from './store/preview/preview.component';
import { ProductsComponent } from './products/products.component';
import { NewProductComponent } from './products/new-product/new-product.component';
import { PreferencesComponent } from './preferences/preferences.component';
import { NavComponent } from './nav/nav.component';
import { LoginComponent } from './login/login.component';
import { ChooseStoreComponent } from './choose-store/choose-store.component';
import { CreateStoreComponent } from './choose-store/create-store/create-store.component';
import { StoreGuard } from './services/store.guard';
import { UserGuard } from './services/user.guard';
import { FormsModule } from '@angular/forms';
import { IconsModule } from './icons/icons.module';
import * as firebase from 'firebase';
import { HttpClientModule } from '@angular/common/http';
import { SnackbarComponent } from './snackbar/snackbar.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

const firebaseConfig = {
  apiKey: 'AIzaSyCYIemjawWYApHGDQ1QpjheX4FArLLPDfo',
  authDomain: 'produtos-app-login.firebaseapp.com',
  databaseURL: 'https://produtos-app-login.firebaseio.com',
  projectId: 'produtos-app-login',
  storageBucket: 'produtos-app-login.appspot.com',
  messagingSenderId: '558255407559',
  appId: '1:558255407559:web:79a7b9b9fa17b455ecd9e2',
  measurementId: 'G-C19JT983YJ'
};

@NgModule({
  declarations: [
    AppComponent,
    OrdersComponent,
    OrderDetailComponent,
    StoreComponent,
    PreviewComponent,
    ProductsComponent,
    NewProductComponent,
    PreferencesComponent,
    NavComponent,
    LoginComponent,
    ChooseStoreComponent,
    CreateStoreComponent,
    SnackbarComponent
  ],
  imports: [
    AppRoutingModule,
    BrowserAnimationsModule,
    BrowserModule,
    FormsModule,
    HttpClientModule,
    IconsModule
  ],
  providers: [ IconsModule, StoreGuard, UserGuard ],
  bootstrap: [ AppComponent ]
})
export class AppModule {
  constructor() {
    if (!firebase.apps.length) {
      firebase.initializeApp(firebaseConfig);
    }
  }
}
