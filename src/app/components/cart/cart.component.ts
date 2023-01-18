import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Address } from 'src/app/models/address';
import { Product } from 'src/app/models/product';
import { LoginService } from 'src/app/services/login.service';
import { OrderService } from 'src/app/services/order.service';
import { FormContent } from '../address/info/info.component';
import { ModalContent } from '../modal/modal.component';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {

  company: string = '';
  userLogged: boolean = false;
  usuario: string = ''
  companyId: string = '';
  product?: Product
  cart: any[] = [];
  responseCart: any[] = []
  @Input()
  show: string = '';
  @Output()
  closeEvent = new EventEmitter();
  total: number = 0;
  deliveryFee: number | string = 0;
  couponDiscount: number = 0;
  usedCoupon = ''
  invalidCoupon?: boolean
  invalidMessage = 'Cupom inválido !'
  empty = true;
  errTemplate: boolean = false;
  hasAddress?: boolean
  msg = `Seu carrinho está vazio`
  code!: string;
  unifiedProducts: boolean = false;

  constructor(private service: OrderService, private loginService: LoginService, private modalService: NgbModal) { }
  
  public ngOnInit(): void {
    
    if(localStorage.getItem('cart') && this.loginService.isAuth()){
      const localCart = JSON.parse(localStorage.getItem('cart')!)
      console.log(localCart.length)
      this.toDatabase(localCart)
    } else 
    this.retrieveProductsOnCart()
    this.hasAddress = localStorage.getItem('hasAddress')? true : false
    console.log(this.hasAddress)
    setTimeout(() => {
      if (!this.empty) {
        this.closeEvent.emit({ 'show': 'show', 'total': this.total + +this.deliveryFee - this.couponDiscount })
      }
    }, 1000)
    console.log(this.cart)
  }
  
  toDatabase(cart: string[] | any){
    console.log(cart)
    const body:any[] = []
    cart.forEach((p:any) => {
      p = {
        "consumerId": localStorage.getItem('userId'),
        "productId": p.id,
        "qty": p.qty
      }
      body.push(p)
    })
    console.log(body)
    this.service.clearCart(localStorage.getItem('userId')!).subscribe()
    this.service.addToDatabase(body).subscribe({
      next: ()=> {
        localStorage.removeItem('cart')
        this.retrieveProductsOnCart()
      }
    })
  }

  retrieveProductsOnCart(show?: boolean) {
    if (this.loginService.isAuth()) {
      this.service.getCart(localStorage.getItem('userId')!).subscribe({
        next: response => {
          this.userLogged = true
          this.empty = false
          this.responseCart = response
          if (this.cart.length > 0) {
            this.cart = []
          }
          Object.values(response).forEach((p:any) => {
            console.log(p)
            this.cart.push(p)
            this.sumItems()
            //   var repeated = this.cart.findIndex(c => {
              //     return c.productId == p.productId;
              // }) > -1;
              //   if(repeated && p.qty == 1){
          //     let uniqueArray: any[] = []
          //   this.cart.forEach(i => {
            //     var duplicated  = uniqueArray.findIndex(ui => {
              //         return i.productId == ui.productId;
              //     }) > -1;
              
              //     if(!duplicated) {
            //         uniqueArray.push(i);
            //     }
            // });
            // uniqueArray.forEach(i => {
            //   if(i.qty == 1)
            //   i.qty = this.cart.filter(c => c.productId == i.productId).length
            // })
            // this.cart = uniqueArray
            // this.unifiedProducts = true
            // }
          });
        
          if(show) this.closeEvent.emit({ 'show': 'show', 'total': this.total + +this.deliveryFee - this.couponDiscount })
          else this.closeEvent.emit({ 'show': '', 'total': this.total + +this.deliveryFee - this.couponDiscount })
          console.log(response)
          this.company = this.cart[0].company
          this.companyId = this.cart[0].companyId
          localStorage.setItem('companyCart', this.cart[0].company)
        },
        error: () => {
          this.cart = []
          this.empty = true
          this.errTemplate = true;
          this.closeEvent.emit({ 'show': '', 'total': this.total + +this.deliveryFee - this.couponDiscount })
        }
      })
    } else {
      if (localStorage.getItem('cart')) {
        this.cart = JSON.parse(localStorage.getItem('cart')!)
        console.log(this.cart)
        this.total = 0
        if(this.cart.length > 0) {
          this.empty = false
          Object.values(this.cart).forEach(p => {
            this.total += p.qty * p.price
          });
          this.company = this.cart[0].company
          this.companyId = this.cart[0].companyId
        }
      }
    }
  }

  sumItems() {
    this.total = 0
    this.cart.forEach((i) => {
      this.total += i.total
    })
    console.log(this.total)
  }

  updateItem(id: string, itemId: string, qty: number, company: string) {
    console.log(id)
    console.log(itemId)
    console.log(qty)
    console.log(company)
    if(this.loginService.isAuth()){
      this.service.getProduct(id).subscribe({
        next: (response: any) => {
          console.log(response)
          this.product = response;
          setTimeout(() => {
            const modalRef = this.modalService.open(ModalContent, { size: 'xl' })
            modalRef.componentInstance.qty = qty
            modalRef.componentInstance.product = this.product;
            modalRef.componentInstance.itemId = itemId
            modalRef.componentInstance.company = company;
            this.retrieveProductsOnCart()
          }, 100)
        }
      })
      } else {
        console.log('local')
        this.product = this.cart.find(i => i.itemId === itemId)
        console.log(this.product)
        const modalRef = this.modalService.open(ModalContent, {size:'xl'})
        modalRef.componentInstance.qty = qty
        modalRef.componentInstance.product = this.product;
        modalRef.componentInstance.company = company;
        modalRef.componentInstance.edit = true
        modalRef.componentInstance.itemId = itemId
      }
  }

  deleteItem(id: string) {
      if(this.loginService.isAuth()){
        // if(this.unifiedProducts){
        //   let product = this.cart.filter(p => p.itemId == id).pop()
        //   let filtered = this.responseCart.filter(i => i.productId == product.productId)
        //     for(let i = 0; i < filtered.length; i++){
        //     this.service.deleteProduct(filtered[i].itemId).subscribe({
        //       next: response => {
        //         this.cart.splice(this.cart.findIndex(c=> c.productId == product.id))
        //         console.log(response)
        //         if (i == filtered.length-1 && this.cart.length < 1) {
        //           this.close()
        //           this.empty = true
        //           this.total = 0
        //         }
        //         this.retrieveProductsOnCart(true)
        //       },
        //       error: err => {
        //         if (err.status == 200) {
        //           console.log('Removido do carrinho')
        //           if (i == filtered.length-1) {
        //             this.close()
        //             this.empty = true
        //           }
        //           this.retrieveProductsOnCart()
        //         } else {
        //           console.log('Erro desconhecido')
        //           // this.cart = []
        //         }
        //       }
        //     })
        //   }
        //   console.log(product);
        //   console.log(filtered);
        // } else {
          this.service.deleteProduct(id).subscribe({
            next: response => {
              console.log(response)
              if (this.cart.length == 1) {
                this.close()
                this.empty = true
                this.total = 0
              }
              this.retrieveProductsOnCart(true)
            },
            error: err => {
              if (err.status == 200) {
                console.log('Removido do carrinho')
                if (this.cart.length == 1) {
                  this.close()
                  this.empty = true
                }
                this.retrieveProductsOnCart()
              } else {
                console.log('Erro desconhecido')
              }
            }
          })
        // }
    } else {
      console.log('carrinho localstorage')
      console.log(this.cart)
      console.log(id)
      console.log(this.cart.findIndex(i => i.itemId == id))
      this.cart.splice(this.cart.findIndex(c => c.itemId == id), 1)
      localStorage.setItem('cart', JSON.stringify(this.cart))
      this.retrieveProductsOnCart()
      if (this.cart.length == 0) {
        this.close()
        this.empty = true
      }
      this.closeEvent.emit({ 'show': 'show', 'total': this.total })
      console.log(this.cart)
    }
  }

  addCoupon(form: NgForm) {
    console.log(form.value.code)
    console.log(this.code)
    this.usedCoupon = form.value.code.toUpperCase()
    if (form.value.code.toUpperCase() == 'MENOS10' && localStorage.getItem('usedCoupon')?.includes('MENOS10')) {
      if(this.total < 20) {
        this.invalidCoupon = true
        this.invalidMessage = 'Cupom válido para pedido mínimo de R$ 20'
        setTimeout(() => {
          setTimeout(() => this.invalidCoupon = false, 2500)
        }, 100);
      } else {
        this.couponDiscount = 10;
        this.code = 'R$10 para todas as Lojas'
        this.closeEvent.emit({ 'show': 'show', 'total': this.total + +this.deliveryFee - this.couponDiscount })
      }
    } else if (form.value.code.toUpperCase() == 'PRIMEIRACOMPRA' && !localStorage.getItem('usedCoupon')?.includes('PRIMEIRACOMPRA')) {
      if(this.total < 50) {
        this.invalidCoupon = true
        this.invalidMessage = 'Cupom válido para pedido mínimo de R$ 50'
        setTimeout(() => {
          setTimeout(() => this.invalidCoupon = false, 2500)
        }, 100);
      } else {
        this.couponDiscount = 25;
        this.code = 'R$25 para o Primeiro Pedido'
        this.closeEvent.emit({ 'show': 'show', 'total': this.total + +this.deliveryFee - this.couponDiscount })
      }
    } else {
      this.invalidCoupon = true
      this.invalidMessage = 'Cupom inválido !'
      setTimeout(() => {
        setTimeout(() => this.invalidCoupon = false, 2500)
      }, 100);
    }
  }

  removeCoupon() {
    this.usedCoupon = '';
    this.couponDiscount = 0;
    this.code = ''
    this.closeEvent.emit({ 'show': 'show', 'total': this.total + +this.deliveryFee - this.couponDiscount })
  }

  close() {
    this.show = ''
    this.closeEvent.emit({ 'show': 'show', 'total': this.total + +this.deliveryFee - this.couponDiscount })
    document.getElementsByTagName('html')[0].style.overflowY = 'scroll'
  }

  confirmOrder() {
    this.showLoader()
    this.service.confirmOrder(localStorage.getItem('userId')!).subscribe({
      next: response => {
        console.log(response)
        if(localStorage.getItem('usedCoupons') == localStorage.getItem('userId') && this.usedCoupon)
        localStorage.setItem('usedCoupons', localStorage.getItem('userId') + this.usedCoupon)
        setTimeout(() => {
          alert('Pedido realizado com sucesso')
          window.location.pathname = 'pedidos'
        },1000)
      },
      error: err => {
        console.log(err)
      }
    })
  }

  login(){
    window.location.pathname = 'entrar'
  }

  addAddress(){
    let location = new Address();
    const modalRef = this.modalService.open(FormContent, {size: 'lg'})
    modalRef.componentInstance.location = location
  }

  showLoader(){
    const spinners = document.querySelectorAll('.spinner-grow')
    document.querySelector('.confirm')?.classList.add('d-none')
    setTimeout(() => spinners[0].classList.remove('d-none'))
    setTimeout(() => spinners[1].classList.remove('d-none'), 50)
    setTimeout(() => spinners[2].classList.remove('d-none'), 100)
  }
}
