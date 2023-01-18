import { formatCurrency } from '@angular/common';
import {Component, EventEmitter, Input, Output} from '@angular/core';
import { ActivatedRoute, Router, RouterStateSnapshot } from '@angular/router';
import {NgbActiveModal, NgbModal} from '@ng-bootstrap/ng-bootstrap';
import { Product } from 'src/app/models/product';
import { LoginService } from 'src/app/services/login.service';
import { OrderService } from 'src/app/services/order.service';
import { ConfirmModalComponent } from '../confirm-modal/confirm-modal.component';

@Component({
  selector: 'modal',
  template: `
  <style>
    counter:focus{
      border-style: 0 none !important;
  border-color: transparent;
  box-shadow: 0 0 !important;
  outline: 0 !important;
    }
    </style>
    <div class="modal-body d-flex col">
      <div >
      <img [src]="setImg(product?.id!)" class="my-5 mx-2" alt="" style="width: 500px; height: 450px;">
      </div>
      <div class="col mb-5 mx-3 position-relative text-center">
        <button type="button py-5 py-5" class="btn-close float-end" aria-label="Close" (click)="activeModal.dismiss('Cross click')"></button>
        <div class="product-info mt-3">
          <p>{{product?.name?.toLocaleUpperCase()}}</p>
          <p>{{product?.description}}</p>
          <p class="text-start mt-5 px-2 text-success">{{fprice}}</p>
        </div>
        <div class="company-info mt-5 mx-4 px-4 pt-2 text-start"  style="border: 1px solid rgba(0,0,0,.2); font-size: .67rem;">
          <p class="px-3">{{product?.company}}</p>
          <hr style="border-top: dashed 3px rgba(0,0,0,.5);">
          <p class="px-2"> Taxa de Entrega: {{deliveryFee}}</p>
        </div>
        <div class="buy btn position-absolute bottom-0 end-0 w-100 " style="height: 50px;">
          <hr class="w-100 mb-4">
        <div class="d-flex align-items-center justify-content-end mb-3">
          <div class="counter mx-3 d-flex justify-content-between align-items-center" style="border: 1px solid rgba(0,0,0,.2); width:120px; height: 50px;">
            <button class="btn primary-text-color py-0" style="border: none; font-size:32px;" (click)="decrement()">-</button> 
            <input type="text" class="qty text-center" [value] = qty readonly style="width: 2rem; font-size:20px; border: none;"> 
            <button class="btn primary-text-color py-0" style="border: none; font-size:32px" (click)="increment()">+</button> 
          </div>
          <button type="button" style="width:250px; height:50px" class="btn primary-color btn-lg float-end fs-6" (click)="addProduct()">Adicionar &nbsp; {{ total }}</button>
        </div>
    </div>
      </div>
    </div>
  `,
  styleUrls: ['./modal.component.css']
})
export class ModalContent {
  // @Input() 
  @Input() product?:Product;
  @Output() openEvent = new EventEmitter();
  fprice!: string;
  total!: string | number;
  @Input()
  qty: number = 1;
  @Input()
  itemId?: number
  @Input()
  edit?: boolean
  deliveryFee: string | number = 'GRÁTIS'
  products: object[] | any = []
  modalsNumber: number = 1;

  constructor(public activeModal: NgbActiveModal, private modalService: NgbModal, private service: OrderService, private loginService: LoginService, private actRouter: Router) {}
  
  ngOnInit(){
    this.total = formatCurrency(this.product!.price * this.qty, 'pt', 'R$');
    if(localStorage.getItem('cart') && !this.loginService.isAuth())
    this.products = JSON.parse(localStorage.getItem('cart')!)
  }

  setImg(id:string){
    return '../../../assets/images/products/' + id + '.jpg'
  }

  increment(){
    if(this.qty < 99)
    this.qty++
    this.total = formatCurrency(this.product!.price * this.qty, 'pt', 'R$');
  }

  decrement(){
    if (this.qty > 1)
    this.qty--
    this.total = formatCurrency(this.product!.price * this.qty, 'pt', 'R$');
  }

  async onCart(){
    console.log(this.qty, this.product!.id)
    let body = {
        "consumerId": localStorage.getItem('userId'),
        "productId": this.product!.id,
        "qty": this.qty
    }
    this.service.addProduct(body).subscribe({
      next: () => window.location.reload()
      ,
      error: err => {
        console.log(err)
        if(err.status == 422){
          const modalRef = this.modalService.open(ConfirmModalComponent)
          modalRef.componentInstance.title = 'Ops'
          modalRef.componentInstance.msg = 'Você possui alguns produtos da loja ' + localStorage.getItem('companyCart') + ' no carrinho. Deseja removê-los?'
          modalRef.componentInstance.okBtn = 'Sim'
          modalRef.componentInstance.cancelBtn = 'Não'
          modalRef.result.then(() => {
            this.service.clearCart(body.consumerId!).subscribe({
              next: () => {
                this.onCart().then(() => window.location.reload())
              }
            })
          })
        }
      }
    })
  }

  onLocalStorage(){
    console.log(this.qty, this.product!.id)
    let body = {
      "itemId": this.products.length,
      "id": this.product?.id,
      "name": this.product?.name,
      "nome": this.product?.name,
      "price": this.product?.price,
      "description": this.product?.description,
      "company": this.product?.company,
      "qty": this.qty
    }
      if(this.edit){
        body.itemId = this.itemId!
        this.products[this.itemId!] = body
        console.log(this.itemId)
        window.location.reload()
      } else {
        if(this.products.length == 0){
          this.products.push(body)
          window.location.reload()
        } else if(this.product?.company == this.products[0].company){ // mesma empresa? 
          let i = this.products.findIndex((p:any) => p.id == body.id) // tem no carrinho ?
          console.log(i)
          if(i >= 0){
            body.itemId = i
            body.qty = this.products[i].qty + this.qty
            this.products[i] = body
          } else {
            this.products.push(body)
          }
          // this.actRouter.navigate([this.actRouter.routerState.snapshot.url])
          // this.activeModal.close()
          window.location.reload()
        } else {
          const modalRef = this.modalService.open(ConfirmModalComponent)
          modalRef.componentInstance.title = 'Ops'
          modalRef.componentInstance.msg = 'Você possui alguns produtos da loja ' + this.products[0]?.company + ' no carrinho. Deseja removê-los?'
          modalRef.componentInstance.okBtn = 'Sim'
          modalRef.componentInstance.cancelBtn = 'Não'
          modalRef.result.then(() => {
            this.products = []
            this.products.push(body)
            localStorage.setItem('cart', JSON.stringify(this.products))
          })
        }
        }
        localStorage.setItem('cart', JSON.stringify(this.products))
        this.modalService.activeInstances.subscribe(list => {
          this.modalsNumber = list.length;
          console.log(this.modalsNumber)
          if(this.modalsNumber <= 1){
            this.activeModal.close()
            window.location.reload()
          }
        })
      }

  addProduct(){
    if(this.loginService.isAuth()){
      this.onCart()
    } else {
      this.onLocalStorage()
    }
  }


}

@Component({templateUrl: './modal.component.html'})
export class ModalComponent {
  constructor(private modalService: NgbModal, private service: OrderService) {}

  open() {
    const modalRef = this.modalService.open(ModalContent);
    modalRef.componentInstance.name = '';
  }

}