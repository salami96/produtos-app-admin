import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ChooseStoreComponent } from './choose-store/choose-store.component';
import { CreateStoreComponent } from './choose-store/create-store/create-store.component';
import { LoginComponent } from './login/login.component';
import { OrdersComponent } from './orders/orders.component';
import { PreferencesComponent } from './preferences/preferences.component';
import { ProductsComponent } from './products/products.component';
import { AuthGuard } from './services/auth.guard';
import { StoreComponent } from './store/store.component';

const routes: Routes = [
  { path: '', redirectTo: 'entrar', pathMatch: 'full'},
  { path: 'entrar', component: LoginComponent },
  { path: 'escolher-loja', component: ChooseStoreComponent },
  { path: 'nova-loja', component: CreateStoreComponent },
  { path: 'pedidos', component: OrdersComponent },
  { path: 'loja', component: StoreComponent },
  { path: 'produtos', component: ProductsComponent },
  { path: 'preferencias', component: PreferencesComponent },
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
