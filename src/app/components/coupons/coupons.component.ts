import { Component, Input, OnInit } from '@angular/core';
import { Coupon } from 'src/app/models/coupon';
import { LoginService } from 'src/app/services/login.service';
import { OrderService } from 'src/app/services/order.service';

@Component({
  selector: 'app-coupons',
  templateUrl: './coupons.component.html',
  styleUrls: ['./coupons.component.css']
})
export class CouponsComponent implements OnInit {

  userAuth: boolean = false;
  @Input()
  coupons: Coupon[] = []

  constructor(private service: OrderService, private loginService: LoginService) { }

  ngOnInit(): void {
    this.userAuth = this.loginService.isAuth()
    if(this.userAuth){
      this.coupons = this.service.getCoupons();
      if(localStorage.getItem('usedCoupons')?.includes(localStorage.getItem('userId')!))
      if(localStorage.getItem('usedCoupons')?.includes('MENOS10')){
        this.coupons = this.coupons.filter(c => c.code != 'MENOS10')
      } else if (localStorage.getItem('usedCoupons')?.includes('PRIMEIRACOMPRA')){
        this.coupons = this.coupons.filter(c => c.code != 'PRIMEIRACOMPRA')
      }
    }
  }

  copy(id:string){
    var range = document.createRange();
    range.selectNode(document.getElementById(id)!);
    window.getSelection()!.removeAllRanges();
    window.getSelection()!.addRange(range);
    document.execCommand("copy");
    window.getSelection()!.removeAllRanges();
  }

}
