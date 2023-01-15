// import { CurrencyPipe, formatCurrency } from '@angular/common';
// import {Component, EventEmitter, Input, Output} from '@angular/core';
// import {NgbActiveModal, NgbModal} from '@ng-bootstrap/ng-bootstrap';
// import { Product } from 'src/app/models/product';
// import { OrderService } from 'src/app/services/order.service';
// // import { CartComponent } from '../cart/cart.component';

// @Component({
//   selector: 'modal',
//   template: `
//   <style>
//     counter:focus{
//       border-style: 0 none !important;
//   border-color: transparent;
//   box-shadow: 0 0 !important;
//   outline: 0 !important;
//     }
//     </style>
//     <div class="modal-body d-flex col">
//       <div>
//       <img [src]="setImg(product.id!)" class="my-5 mx-2" alt="" style="width: 500px; height: 450px;">
//       </div>
//       <div class="col mb-5 mx-3 position-relative text-center">
//         <button type="button py-5 py-5" class="btn-close float-end" aria-label="Close" (click)="activeModal.close('Cross click')"></button>
//         <div class="product-info mt-3">
//           <p>{{product!.name!.toLocaleUpperCase()}}</p>
//           <p>{{product!.description}}</p>
//           <p class="text-start mt-5 px-2 text-success">{{fprice}}</p>
//         </div>
//         <div class="company-info mt-5 mx-4 px-4 pt-2 text-start"  style="border: 1px solid rgba(0,0,0,.2); font-size: .67rem;">
//           <p class="px-3">{{product!.company}}</p>
//           <hr style="border-top: dashed 3px rgba(0,0,0,.5);">
//           <p class="px-2"> Taxa de Entrega: {{deliveryFee}}</p>
//         </div>
//         <div class="buy btn position-absolute bottom-0 end-0 w-100 " style="height: 50px;">
//           <hr class="w-100 mb-4">
//         <div class="d-flex align-items-center justify-content-end mb-3">
//           <div class="counter mx-3 d-flex justify-content-between align-items-center" style="border: 1px solid rgba(0,0,0,.2); width:120px; height: 50px;">
//             <button class="btn primary-text-color py-0" style="border: none; font-size:32px;" (click)="decrement()">-</button> 
//             <input type="text" class="qty text-center" [value] = qty readonly style="width: 2rem; font-size:20px; border: none;"> 
//             <button class="btn primary-text-color py-0" style="border: none; font-size:32px" (click)="increment()">+</button> 
//           </div>
//           <button type="button" style="width:250px; height:50px" class="btn primary-color btn-lg float-end fs-6" (click)="updateItem()">Adicionar &nbsp; {{ total }}</button>
//         </div>
//     </div>
//       </div>
//     </div>
//   `,
//   styleUrls: ['./update.component.css']
// })
// export class UpdateContent {
//   // @Input() 
//   @Input() product!:Product;
//   @Output() openEvent = new EventEmitter();
//   fprice!: string;
//   total!: string | number;
//   @Input()
//   qty: number = 1;
//   @Input()
//   itemId?: number;
//   deliveryFee: string | number = 'GRÁTIS'

//   constructor(public activeModal: NgbActiveModal, private service: OrderService) {}
  
//   ngOnInit(){
//     this.total = formatCurrency(this.product!.price * this.qty, 'pt', 'R$');
//   }

//   setImg(id:string){
//     return '../../../assets/images/products/' + id + '.jpg'
//   }

//   increment(){
//     if(this.qty < 99)
//     this.qty++
//     this.total = formatCurrency(this.product!.price * this.qty, 'pt', 'R$');
//   }

//   decrement(){
//     if (this.qty > 1)
//     this.qty--
//     this.total = formatCurrency(this.product!.price * this.qty, 'pt', 'R$');
//   }

//   updateItem(){
//     console.log(this.qty, this.product!.id)
//     let body = {
//         "consumerId": "229",
//         "productId": this.product!.id,
//         "qty": this.qty
//     }
//     this.service.editProduct(this.itemId! ,this.qty).subscribe({
//       next: response => console.log(response),
//       error: err => console.log(err)
//     })
//     this.activeModal.close()
//     window.location.reload()
//     // this.openEvent.emit(true)
//     // CartComponent.call(new CartComponent, this.service)
//   }


// }

// @Component({templateUrl: './update.component.html'})
// export class ModalComponent {
//   constructor(private modalService: NgbModal, private service: OrderService) {}

//   open() {
//     const modalRef = this.modalService.open(UpdateContent);
//     modalRef.componentInstance.name = '';
//   }

//   // public onReload(evt:boolean|Event){
//   //   let cart = new CartComponent(this.service)
//   //   cart.ngOnInit()
//   //   cart.show = 'show'
//   // }
// }