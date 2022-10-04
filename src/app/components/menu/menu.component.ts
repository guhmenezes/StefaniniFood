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
  product?: Product;

  constructor(private actRoute: ActivatedRoute, private service: OrderService, private modalService: NgbModal) { }

  ngOnInit(): void {
    this.getAllProducts();
  }

  getAllProducts(){
    this.service.getMenu(this.actRoute.snapshot.paramMap.get('id')!).subscribe({
      next: response => {
          Object.values(response).forEach(p => {
            console.log(p)
            this.menu.push(p)    
            console.log(this.menu)      
          });
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

}
