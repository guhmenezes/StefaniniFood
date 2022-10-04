import { KeyValue } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { CustomerService } from 'src/app/services/customer.service';
import { LocalService } from 'src/app/services/local.service';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css']
})
export class OrdersComponent implements OnInit {

  orders: Map<String,any> = new Map();
  activeOrders: Map<String,any> = new Map();
  completedOrders: Map<String,any> = new Map();
  // long:number = 0;
  // lat:number = 0;

  constructor(private service: CustomerService) { }

  ngOnInit(): void {
    // this.getCurrentLocation()
    this.getOrders()
    // this.locali()
  }

  // locali(){
  //   console.log(this.local.getAddress())
  //   // console.log(this.local.local)
  //   // this.local.getAddress().subscribe({
  //   //   next: response => {
  //   //     console.log(response.toString())
  //   //   },
  //   //   error: err => {
  //   //     console.log(err)
  //   //   }
  //   // });
  // }

  
  // getCurrentLocation() {
  //   if (navigator.geolocation) {
  //    navigator.geolocation.getCurrentPosition(position => {
  //     this.lat = position.coords.latitude;
  //     this.long = position.coords.longitude;
  //    });
  //   }
  //  else {
  //   alert("Geolocation is not supported by this browser.");
  //   }
  //  }

  getOrders(){
    this.service.getOrders(localStorage.getItem('customerId')!).subscribe({
      next: response => {
        console.log(response)
        Object.entries(response).forEach(([id, order]) => {
          console.log(id)
          console.log(order)
          this.orders.set(id, order)
        })
        
        this.orders.forEach((v, k) => {
          console.log(v[0].orderStatus,k)
          if(v[0].orderStatus == 'FINALIZADO'){
            this.completedOrders.set(k,v)
            console.log(this.completedOrders)
          } else if(v[0].orderStatus == 'EM_PREPARACAO'){
            this.activeOrders.set(k,v)
            console.log(this.activeOrders)
          } else {
            console.log('Erro')
          }
        })
        // console.log(this.orders)
        // Object.keys(response).forEach(k => {
        //   console.log(k)
        //   this.orderId.push(k);
        // })
        // Object.values(response).forEach((o:any) => {
        //   console.log(typeof(o), o)
        //   Object.values(o).forEach((p:any) => {
        //     if(p.orderStatus === "FINALIZADO"){
        //       this.completedOrders.push(o)
        //       console.log(this.completedOrders)}
        //     else if (p.orderStatus === "EM_PREPARACAO"){
          //       this.activeOrders.push(o)
          //       console.log(this.activeOrders)
        //     }
        //   })
        // })
      },
      error: err => {
        console.log(err)
      }
    });
    // this.orders.forEach(o => {
    //   if(o.status === 'FINALIZADO'){
    //     this.completedOrders.unshift()
    //   }
    // })
    // for(let i = 0; i < this.orders.length; i++ ){
    //   if(this.compare(this.orders[i], this.orders[i+1])){
    //     this.orders[i+1].nome = [this.orders[i+1].nome, this.orders[i].nome]
    //     this.orders[i+1].qty = [this.orders[i+1].qty, this.orders[i].qty]
    //     this.orders[i].pop()
    //   }
    //   console.log(this.orders)
    // }
  }

  separe(item:any){
    // if(item.orderStatus == 'EM_PREPARACAO'){
      Object.entries(item).forEach(([id, order]) => {
        console.log(id)
        console.log(order)
        this.orders.set(id, order)

        // let obj = {
        //   'id': id, 
        //   'products' : [order]
        // }
        // this.orderId.unshift(id[0])
        // console.log(this.orderId)
        // Object.values(id).forEach((order) => {
        //   console.log(order)
        //   this.orders.push(order)
        // })
        // this.orders.unshift(obj)
      })
      console.log(this.orders)
    // }
  }

  compare(a:any,b:any){
    if(a.company == b.company){
      return true
    }
    return false
  }

  desc = (a: KeyValue<String,any>, b: KeyValue<String,any>): number => {
    return a.key > b.key ? -1 : (b.key > a.key ? 1 : 0);
  }
}
