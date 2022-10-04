import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IndexComponent } from './components/index/index.component';
import { MenuComponent } from './components/menu/menu.component';
import { ProductInfoComponent } from './components/menu/product-info/product-info.component';
import { OrdersComponent } from './components/orders/orders.component';
import { RegisterComponent } from './components/register/customer/register.component';
import { RegisterPartnerComponent } from './components/register/partner/register-partner/register-partner.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'index',
    pathMatch: 'full'
  },
  {
    path: 'cadastro',
    component: RegisterComponent
  },
  {
    path: 'parceiro',
    component: RegisterPartnerComponent
  },
  {
    path: 'index',
    component: IndexComponent
  },
  {
    path: 'pedidos',
    component: OrdersComponent
  },
  {
    path: 'cardapio/:id',
    component: MenuComponent
  },
  {
    path: 'cardapio/:id/:product',
    component: ProductInfoComponent
  }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
