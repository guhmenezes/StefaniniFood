import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Company } from 'src/app/models/company';
import { Product } from 'src/app/models/product';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {

  @Output()
  filteredCompanies = new EventEmitter();
  @Input()
  companies: Company[] = [];
  @Output()
  filteredProducts = new EventEmitter();
  @Input()
  products: Product[] = [];
  @Output()
  filteredOrders = new EventEmitter();
  @Input()
  orders:Map<String,any> = new Map()
  @Input()
  placeholder = ''
  active: boolean = false;

  constructor() { }

  ngOnInit(): void {
    console.log(this.orders)
  }

  set search(filterBy: string){

    if(this.companies.length > 0){
      try{
        this.filteredCompanies.emit({
          'filterBy' : filterBy,
          'companies': this.companies.filter((company: any) => company.name.toLocaleLowerCase().indexOf(filterBy.toLocaleLowerCase()) > -1)
        })
      } catch (e){
        this.filteredCompanies.emit({
          'filterBy' : filterBy,
          'companies': ''
        })
      }
    } else if (this.products.length > 0){
      try{
        this.filteredProducts.emit({
          'filterBy' : filterBy,
          'products': this.products.filter((product: any) => product.name.toLocaleLowerCase().indexOf(filterBy.toLocaleLowerCase()) > -1)
        })
      } catch (e){
        this.filteredProducts.emit({
          'filterBy' : filterBy,
          'products': ''
        })
      }
    } else if (this.orders.size >= 0){
      try{
        if(filterBy != undefined) filterBy = filterBy.replace(/\s/g, '')
        if(filterBy == '') throw new Error()
        let filtered = new Map(this.orders)
        if(filtered.size == 0) filtered = this.orders
        filtered.forEach((v,k) => {
          let filteredOrder = v.filter((order:any) => 
          order.company.toLocaleLowerCase()
          // .replace(/\s/g, '')
          // .replace(/[èéêë]/g,"e")
          // .replace(/[àáâãäå]/g,"a")
          .indexOf(filterBy.toLocaleLowerCase()) > -1 ||
          order.productName.toLocaleLowerCase()
          // .replace(/\s/g, '')
          // .replace(/[èéêë]/g,"e")
          // .replace(/[àáâãäå]/g,"a")
          .indexOf(filterBy.toLocaleLowerCase()) > -1)
          console.log(filteredOrder)
          if (filteredOrder.length == 0) filtered.delete(k)
        })
        this.filteredOrders.emit({
          'filterBy' : filterBy,
          'orders': filtered
        })
      } catch (e){
        this.filteredOrders.emit({
          'filterBy' : filterBy,
          'orders': ''
        })
      }
    }else {
      console.log('erro ao filtrar')
    }
  }

  get search(){
    return ''
  }
}
