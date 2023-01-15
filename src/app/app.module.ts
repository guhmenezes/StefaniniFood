import { LOCALE_ID, NgModule } from '@angular/core';
import {registerLocaleData} from '@angular/common';
import localePt from '@angular/common/locales/pt'
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { RegisterComponent } from './components/register/customer/register.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxMaskModule } from 'ngx-mask';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { RegisterPartnerComponent } from './components/register/partner/register-partner/register-partner.component';
import { IndexComponent } from './components/index/index.component';
import { CompaniesComponent } from './components/companies/companies.component';
import { MenuComponent } from './components/menu/menu.component';
import { ProductInfoComponent } from './components/menu/product-info/product-info.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ModalComponent, ModalContent } from './components/modal/modal.component';
import { CartComponent } from './components/cart/cart.component';
import { OrdersComponent } from './components/orders/orders.component';
import { SearchComponent } from './components/search/search.component';
import { AddressComponent } from './components/address/address.component';
import { FormContent, InfoComponent, InfoContent } from './components/address/info/info.component';
import { CouponsComponent } from './components/coupons/coupons.component';
// import { UpdateContent } from './components/cart/update/update.component';
import { CustomerLoginComponent } from './components/login/customer/customer.component';
import { AuthInterceptor } from './guard/auth.interceptor';
import { AlertModalComponent } from './components/alert-modal/alert-modal.component';
import { ConfirmModalComponent } from './components/confirm-modal/confirm-modal.component'

registerLocaleData(localePt, 'pt');

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    RegisterComponent,
    RegisterPartnerComponent,
    IndexComponent,
    CompaniesComponent,
    MenuComponent,
    ProductInfoComponent,
    ModalComponent,
    ModalContent,
    CartComponent,
    OrdersComponent,
    SearchComponent,
    AddressComponent,
    InfoComponent,
    CouponsComponent,
    // UpdateContent,
    FormContent,
    InfoContent,
    CustomerLoginComponent,
    AlertModalComponent,
    ConfirmModalComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    NgxMaskModule.forRoot(),
    AppRoutingModule,
    NgbModule
  ],
  providers: [
    { 
      provide: LOCALE_ID, 
      useValue: 'pt' 
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
