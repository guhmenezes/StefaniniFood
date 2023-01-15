import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Address } from 'src/app/models/address';
import { Product } from 'src/app/models/product';
import { LoginService } from 'src/app/services/login.service';
import { OrderService } from 'src/app/services/order.service';
import { FormContent } from '../address/info/info.component';
import { ModalContent } from '../modal/modal.component';
// import { UpdateContent } from './update/update.component';

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
  @Input()
  show: string = '';
  @Output()
  closeEvent = new EventEmitter();
  total: number = 0;
  deliveryFee: number | string = 0;
  couponDiscount: number = 0;
  empty = true;
  errTemplate: boolean = false;
  hasAddress?: boolean
  msg = `Seu carrinho está vazio`
  code!: string;

  constructor(private service: OrderService, private loginService: LoginService, private modalService: NgbModal) { }
  
  public ngOnInit(): void {
    
    if(localStorage.getItem('cart') && this.loginService.isAuth()){
      const localCart = JSON.parse(localStorage.getItem('cart')!)
      console.log(localCart.length)
      this.toDatabase(localCart)
    }
    this.hasAddress = localStorage.getItem('hasAddress')? true : false
    console.log(this.hasAddress)
    // this.hasAddress = true
    this.retrieveProductsOnCart()
    setTimeout(() => {
      // document.querySelector('div.offcanvas-backdrop.fade.show')?.remove()
      // document.querySelector<HTMLElement>('.offcanvas-backdrop')!.style.backgroundColor = 'transparent'
      if (!this.empty) {
        this.closeEvent.emit({ 'show': 'show', 'total': this.total + +this.deliveryFee - this.couponDiscount })
      }
    }, 1000)
    console.log(this.cart)
    // console.log(localStorage.getItem('cart'))
    

    // if (this.show === 'show'){
    //   document.getElementsByTagName('html')[0].style.overflowY = 'hidden'
    // }
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
      
    })
    // cart.forEach((p:any) => {
    //   let body = {
    //     "consumerId": localStorage.getItem('userId'),
    //     "productId": p.id,
    //     "qty": p.qty
    // }
    // console.log(body)
    //   this.service.addProduct(body).subscribe({
    //     next: response => {
    //       console.log(response)
    //       this.retrieveProductsOnCart()
    //       localStorage.removeItem('cart')
    //     }
    //   })
    // })
  }

  retrieveProductsOnCart(show?: boolean) {
    if (this.loginService.isAuth()) {
      this.service.getCart(localStorage.getItem('userId')!).subscribe({
        next: response => {
          this.userLogged = true
          this.empty = false
          if (this.cart.length > 0) {
            this.cart = []
          }
          Object.values(response).forEach(p => {
            this.cart.push(p)
            this.sumItems()
          });
          if(show) this.closeEvent.emit({ 'show': 'show', 'total': this.total + +this.deliveryFee - this.couponDiscount })
          else this.closeEvent.emit({ 'show': '', 'total': this.total + +this.deliveryFee - this.couponDiscount })
          console.log(response)
          this.company = this.cart[0].company
          this.companyId = this.cart[0].companyId
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
        // this.closeEvent.emit({ 'show': '', 'total': this.total + +this.deliveryFee - this.couponDiscount })
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
            // modalRef.componentInstance.total = 
          }, 100)
          // this.product = new Product();
          // this.product.company
          // console.log(this.product) 
        }
      })
      // this.service.getMenu(this.companyId).subscribe({
        //   next: response => {
          //     let menu: Product[] = [];
          //     menu.push(response);
          //     this.product = menu.find(p => p.id === id)
          //     console.log(this.product)
          //   }
          // })
          // console.log(this.menu)
          // this.product = this.menu.find(p => p.id === id)
          // console.log(this.product)
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
        // modalRef.result.then((value) => {
        //   console.log(value)
        //   console.log(this.product)
        //   if (value == qty){
        //     console.log('acerto mizeravi')
        //   }
        // },
        //   (reason) => {
        //     console.log('fechow')
        //   })
      }
  }

  deleteItem(id: string) {
      if(this.loginService.isAuth()){
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
            // this.cart = []
          }
        }
      })
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
    if (form.value.code.toUpperCase() == 'MENOS10') {
      this.couponDiscount = 10;
      this.code = 'R$10 para todas as Lojas'
      this.closeEvent.emit({ 'show': 'show', 'total': this.total + +this.deliveryFee - this.couponDiscount })
    } else if (form.value.code.toUpperCase() == 'PRIMEIRACOMPRA') {
      this.couponDiscount = 25;
      this.code = 'R$25 para o Primeiro Pedido'
      this.closeEvent.emit({ 'show': 'show', 'total': this.total + +this.deliveryFee - this.couponDiscount })
    }
  }

  removeCoupon() {
    this.couponDiscount = 0;
    this.code = ''
    this.closeEvent.emit({ 'show': 'show', 'total': this.total + +this.deliveryFee - this.couponDiscount })
  }

  close() {
    this.show = ''
    this.closeEvent.emit({ 'show': 'show', 'total': this.total + +this.deliveryFee - this.couponDiscount })
    document.getElementsByTagName('html')[0].style.overflowY = 'scroll'
    // if (this.empty)
    //   this.ngOnInit()
  }

  confirmOrder() {
    this.service.confirmOrder(localStorage.getItem('userId')!).subscribe({
      next: response => {
        console.log(response)
        alert('Pedido realizado com sucesso')
        window.location.pathname = 'pedidos'
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
}
