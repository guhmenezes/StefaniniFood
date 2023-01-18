import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { Router, TitleStrategy } from '@angular/router';
import { Company } from 'src/app/models/company';
import { CustomerService } from 'src/app/services/customer.service';
import { LocalService } from 'src/app/services/local.service';
import { LoginService } from 'src/app/services/login.service';
import { OrderService } from 'src/app/services/order.service';
import { CartComponent } from '../cart/cart.component';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {


  @Input()
  show = ''
  addresses: string[] = []
  total = 0;
  searchBy = '';
  lat?: number;
  long?: number;
  logged = false
  showNav: boolean = true;
  
  constructor(private service: CustomerService, private loginService: LoginService) { }

  ngOnInit(): void {
    if (localStorage.getItem('token')){
      this.showNav = true
      this.getCustomer()
    } else {
      this.loginService.showMenuEmitter.subscribe(show => this.showNav = show)
    }
    // if (this.addresses.length = 0){
    //   this.addresses.push('Endereço não informado')
    // }

    // window.addEventListener('scroll', ()=>{
    //   if(scrollY > 0) {
    //     this.show = ''
    //   }
    // })

    document.addEventListener('click', (e:any)=>{
      // if(!(e.target.parentNode.id.substring(0,9) == 'offcanvas') || this.show == 'show') this.show = ''
      // console.log(e)
      });

    // document.addEventListener('keydown', (k)=>{
    //   console.log(k)
    //   if(k.key === 'Escape') {
    //     this.show = ''
    //     document.getElementsByTagName('html')[0].style.overflowY = 'scroll'
    //   }
    // })

      // document.getElementsByTagName('html')[0].style.overflowY = 'hidden'



    
  }

  onClose(evt:any){
    // if (this.show == 'show') {
    // this.show = evt
    console.log(evt)
    if(evt.total <= 0){
      document.querySelector('.cart')?.classList.remove('primary-color');
      document.querySelector('.cart')?.querySelector('a')?.classList.remove('text-light');
      this.total = 0;
    } else {
      document.querySelector('.cart')?.querySelector('a')?.classList.add('text-light');
      document.querySelector('.cart')?.classList.add('primary-color');
      this.total = evt.total
    }
    this.show = evt.show;

  }

  toggleCart(){
    if(this.show == 'show') {
      this.show = ''
    } else {
      this.show = 'show'
    }
  }


  getCustomer(){
    this.service.getCustomerInfo(localStorage.getItem('user')!).subscribe({
      next: response => {
        console.log(response)
        localStorage.setItem('userId', response.id)
        if(!localStorage.getItem('usedCoupons'))
        localStorage.setItem('usedCoupons', response.id)
        this.logged = true;
        if(response.address.length == 0) {
          localStorage.removeItem('hasAddress')
          localStorage.removeItem('defaultAddress')
        }
        else {
          localStorage.setItem('hasAddress', 'true')
          response.address.forEach((a:any) => {
            this.addresses.push(a)
          });
        // response.foreach(response.address).forEach((a:any) => {
        //   this.addresses.push(a)
        // });
        // localStorage.setItem('customerId', response[0].id)
        }
      },
      error: err => {
        console.log(err)
        if(err.status == 403){
          // alert('deslogou')
          this.loginService.logout(true)
        }
      }
    })
  }

  login(){
    window.location.pathname = '/entrar'
  }

  logout(){
    this.loginService.logout()
  }

  // search(){
  //   this.filter.emit(this.searchBy)
  //   console.log("disaprou")
  //   // filter((company: any) => product.name.toLocaleLowerCase().indexOf(input.toLocaleLowerCase()) > -1)
  //   // return filteredProducts
  // }

  // filterCompanies(evt: Event){
  //   console.log(evt)
  // }
}
