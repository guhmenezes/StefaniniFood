import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Product } from 'src/app/models/product';
import { OrderService } from 'src/app/services/order.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {

  company: string = '';
  cart: any[] = [];
  @Input()
  show: string = '';
  @Output()
  closeEvent = new EventEmitter();
  total: number = 0;
  deliveryFee: number | string = 0;
  couponDiscount: number = 10;
  empty = true;
  errTemplate: boolean = false;
  msg = 'Seu carrinho está vazio.'

  constructor(private service: OrderService) { }

  public ngOnInit(): void {
    this.retrieveProductsOnCart()
    setTimeout(() => {      
      if (!this.empty){
        this.closeEvent.emit('show')
      }
    }, 1000)
    console.log(this.cart)
  }

  retrieveProductsOnCart(){
    this.service.getCart('229').subscribe({
      next: response => {
        this.empty = false
        if(this.cart.length > 0){
          this.cart = []
        }
        Object.values(response).forEach(p => {
          this.cart.push(p)
          this.sumItems()
        });
        console.log(response)
        this.company = this.cart[0].company
      },
      error: () => {
        this.cart = []
        this.empty = true
        this.errTemplate = true;
      }
    })
  }

  sumItems(){
    this.total = 0
    this.cart.forEach((i) => {
      this.total += i.total
    })
    console.log(this.total)
  }

  updateItem(id:string){

  }

  deleteItem(id:string){
    this.service.deleteProduct(id).subscribe({
      next: response => {
        console.log(response)
        if(this.cart.length == 1){
          this.close()
          this.empty = true
          }
          this.retrieveProductsOnCart()
      },
      error: err => {
        if (err.status == 200){
          console.log('Removido do carrinho')
          if(this.cart.length == 1){
          this.close()
          this.empty = true
          }
          this.retrieveProductsOnCart()
        } else {
          console.log('Erro desconhecido')
          // this.cart = []
        }
      }
    })
  }

  close(){
    this.show = ''
    this.closeEvent.emit(this.show)
    if(this.empty)
    this.ngOnInit()
  }

  confirmOrder(){
    this.service.confirmOrder('229').subscribe({
      next: response => {
        console.log(response)
      },
      error: err => {
        console.log(err)
      }
    })
  }

}
