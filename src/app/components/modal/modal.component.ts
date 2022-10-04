import { CurrencyPipe, formatCurrency } from '@angular/common';
import {Component, EventEmitter, Input, Output} from '@angular/core';
import {NgbActiveModal, NgbModal} from '@ng-bootstrap/ng-bootstrap';
import { Product } from 'src/app/models/product';
import { OrderService } from 'src/app/services/order.service';
import { CartComponent } from '../cart/cart.component';

@Component({
  selector: 'modal',
  template: `
    <div class="modal-body d-flex col">
      <div>
        <img src="https://static-images.ifood.com.br/image/upload/t_medium/pratos/2f4e4610-0107-4efa-b485-c2adaa565479/202206141117_M404_i.jpg" 
        class="my-5" alt="">
      </div>
      <div class="col mb-5 mx-3 position-relative text-center">
        <button type="button py-5 py-5" class="btn-close float-end" aria-label="Close" (click)="activeModal.close('Cross click')"></button>
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
        <div class="counter position-absolute bottom-0 end-0 w-100">
        <hr class="mb-4">
        <button class="btn btn-outline-primary" (click)="decrement()">-</button> 
        <input type="text" class="w-25" [value] = qty readonly> 
        <button class="btn btn-outline-primary" (click)="increment()">+</button> 
        <button type="button" style="width:220px;" class="btn btn-primary btn-lg float-end mb-3 fs-6" (click)="onCart()">Adicionar &nbsp; {{ total }}</button>
    </div>
      </div>
    </div>
  `
})
export class ModalContent {
  // @Input() 
  @Input() product?:Product;
  @Output() openEvent = new EventEmitter();
  fprice!: string;
  total!: string | number;
  qty: number = 2;
  deliveryFee: string | number = 'GRÁTIS'

  constructor(public activeModal: NgbActiveModal, private service: OrderService) {}

  ngOnInit(){
  this.fprice = formatCurrency(this.product!.price, 'pt', 'R$')
  this.total = this.fprice;
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

  onCart(){
    console.log(this.qty, this.product!.id)
    let body = {
        "consumerId": "229",
        "productId": this.product!.id,
        "qty": this.qty
    }
    this.service.addProduct(body).subscribe({
      next: response => console.log(response),
      error: err => console.log(err)
    })
    this.activeModal.close()
    window.location.reload()
    // this.openEvent.emit(true)
    // CartComponent.call(new CartComponent, this.service)
  }


}

@Component({templateUrl: './modal.component.html'})
export class ModalComponent {
  constructor(private modalService: NgbModal, private service: OrderService) {}

  open() {
    const modalRef = this.modalService.open(ModalContent);
    modalRef.componentInstance.name = '';
  }

  public onReload(evt:boolean|Event){
    let cart = new CartComponent(this.service)
    cart.ngOnInit()
    cart.show = 'show'
  }
}