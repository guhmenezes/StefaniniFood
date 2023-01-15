import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Product } from 'src/app/models/product';
import { OrderService } from 'src/app/services/order.service';
import { ModalComponent, ModalContent } from '../modal/modal.component';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {

  menu: Product[] = [];
  company: string = ''
  product?: Product;
  initialPosition!: number;
  empty!: boolean;
  notFound?: boolean;
  filteredProducts: Product[] = []

  constructor(private actRoute: ActivatedRoute, private service: OrderService, private modalService: NgbModal) { }

  ngOnInit(): void {
    console.log(this.menu)
    this.getAllProducts();
    setTimeout(()=> {
    },200)

    this.filteredProducts = this.menu

  }

  getAllProducts(){
    this.service.getMenu(this.actRoute.snapshot.paramMap.get('id')!).subscribe({
      next: response => {
          Object.values(response).forEach(p => {
            console.log(p)
            this.menu.push(p) 
            this.company = this.menu[0].company   
            console.log(this.menu)      
          });
          if (this.menu.length > 0){
            this.empty = false
          } else {
            this.empty = true
          }
        },
        error: () => {
          this.empty = true
        }
    })
  }

  showInfo(productId: string){
    console.log(productId)
        console.log(this.menu)
        this.product = this.menu.find(p => p.id === productId)
        console.log(this.product)
        const modalRef = this.modalService.open(ModalContent, {size:'xl'})
        modalRef.componentInstance.product = this.product;
  }

  setImg(id:string){
    return '../../../assets/images/products/' + id + '.jpg'
  }

  filterProducts(evt: any){
    console.log(evt)
    this.filteredProducts = evt.products;
    if (this.filteredProducts.length == 0){
      if (evt.filterBy == '' || evt.filterBy == null){
        this.notFound = false;
        this.filteredProducts = this.menu;
        document.querySelector<HTMLInputElement>('#search')!.value = ''
      } else {
        this.notFound = true;
      }
    } else {
      this.notFound = false;
    }
  }

  // prev(){
  //   const slide:HTMLElement|null = document.querySelector('.slide')
  //   const cards = document.getElementsByClassName('card')
  //   console.log(cards)
  //   let maxRight = cards[cards.length-1].getBoundingClientRect().x + 300;
  //   console.log(maxRight)
  //   var size = this.menu.length * 300
  //   slide!.style.left = size-maxRight + 'px' 
  //   let position = slide!.getBoundingClientRect().x;
  //   // if (this.menu.length > 4 && maxRight){
  //   //   // document.querySelector('.slide')!.innerHTML = 'teste'
  //   //   position -= 210;
  //   //   slide!.style.left = position + 'px' 
  //   //   console.log(position)
  //   // }
  // }

  // next(){
  //   const slide:HTMLElement|null = document.querySelector('.slide')
  //   var size = this.menu.length * 300
  //   let position = slide!.getBoundingClientRect().x;
  //   slide!.style.left = position*2 + 'px' 
  //   // if (this.menu.length > 4 &&  position < this.initialPosition) {
  //   //   // document.querySelector('.slide')!.innerHTML = 'teste'
  //   //   position += 210;
  //   //   slide!.style.left = position + 'px' 
  //   //   console.log(position)
  //   // }
  // }

}
