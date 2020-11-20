import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ChooseStoreComponent } from './choose-store/choose-store.component';
import { LoginComponent } from './login/login.component';
import { OrdersComponent } from './orders/orders.component';
import { PreferencesComponent } from './preferences/preferences.component';
import { ProductsComponent } from './products/products.component';
import { AuthGuard } from './services/auth.guard';
import { StoreComponent } from './store/store.component';

const routes: Routes = [
  { path: '', redirectTo: 'entrar', pathMatch: 'full'},
  { path: 'entrar', component: LoginComponent },
  { path: 'escolher-loja', component: ChooseStoreComponent, canActivate: [ AuthGuard ] },
  { path: 'pedidos', component: OrdersComponent, canActivate: [ AuthGuard ] },
  { path: 'loja', component: StoreComponent, canActivate: [ AuthGuard ] },
  { path: 'produtos', component: ProductsComponent, canActivate: [ AuthGuard ] },
  { path: 'preferencias', component: PreferencesComponent, canActivate: [ AuthGuard ] },
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
