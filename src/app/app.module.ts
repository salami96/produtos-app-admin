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
    CreateStoreComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [ StoreGuard, UserGuard ],
  bootstrap: [ AppComponent ]
})
export class AppModule { }
