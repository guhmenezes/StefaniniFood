import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { CustomerService } from 'src/app/services/customer.service';
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
  
  constructor(private service: CustomerService) { }

  ngOnInit(): void {
    // if (this.addresses.length = 0){
    //   this.addresses.push('Endereço não informado')
    // }
    this.getCustomer()
  }

  toggleCart(){
    if(this.show == 'show') this.show = ''
    else this.show = 'show'
  }

  onClose(evt:string){
    // if (this.show == 'show') {
    this.show = evt

  }

  getCustomer(){
    this.service.getCustomerInfo('89001093086').subscribe({
      next: response => {
        console.log(response)
        this.addresses.push(response[0].address)
        localStorage.setItem('customerId', response[0].id)
      },
      error: err => {
        console.log(err)
      }
    })
  }
}
