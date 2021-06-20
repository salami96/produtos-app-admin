import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ChooseStoreComponent } from './choose-store/choose-store.component';
import { CreateStoreComponent } from './choose-store/create-store/create-store.component';
import { LoginComponent } from './login/login.component';
import { OrderDetailComponent } from './orders/order-detail/order-detail.component';
import { OrdersComponent } from './orders/orders.component';
import { PreferencesComponent } from './preferences/preferences.component';
import { ProductsComponent } from './products/products.component';
import { StoreGuard } from './services/store.guard';
import { UserGuard } from './services/user.guard';
import { PreviewComponent } from './store/preview/preview.component';
import { StoreComponent } from './store/store.component';

const routes: Routes = [
  { path: '', redirectTo: 'entrar', pathMatch: 'full'},
  { path: 'entrar', component: LoginComponent },
  { path: 'escolher-loja', component: ChooseStoreComponent, canActivate: [ UserGuard ] },
  { path: 'nova-loja', component: CreateStoreComponent, canActivate: [ UserGuard ] },
  { path: 'pedidos', component: OrdersComponent, canActivate: [ UserGuard, StoreGuard ] },
  { path: 'pedidos/:id', component: OrderDetailComponent, canActivate: [ UserGuard, StoreGuard ] },
  { path: 'loja', component: StoreComponent, canActivate: [ UserGuard, StoreGuard ] },
  { path: 'loja/preview', component: PreviewComponent, canActivate: [ UserGuard, StoreGuard ] },
  { path: 'produtos', component: ProductsComponent, canActivate: [ UserGuard, StoreGuard ] },
  { path: 'preferencias', component: PreferencesComponent, canActivate: [ UserGuard, StoreGuard ] },
  { path: '**', redirectTo: 'entrar', pathMatch: 'full'},
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forRoot(routes)
  ],
  declarations: [],
  exports: [ RouterModule ]
})
export class AppRoutingModule { }
