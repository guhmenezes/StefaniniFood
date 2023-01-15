import { KeyValue } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { CustomerService } from 'src/app/services/customer.service';
import { LocalService } from 'src/app/services/local.service';
import { LoginService } from 'src/app/services/login.service';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css']
})
export class OrdersComponent implements OnInit {
  
  orders: Map<String,any> = new Map();
  filteredOrders: Map<String,any> = new Map();
  activeOrders: Map<String,any> = new Map();
  completedOrders: Map<String,any> = new Map();
  active:boolean = false;
  completed:boolean = false;
  filter?: boolean
  empty?: boolean
  // long:number = 0;
  // lat:number = 0;
  
  constructor(private service: CustomerService, private loginService: LoginService) { }
  
  ngOnInit(): void {
    // this.getCurrentLocation()
    this.getOrders()
    this.filteredOrders = this.orders
    console.log(this.activeOrders.has('740'))

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
    this.service.getOrders(localStorage.getItem('userId')!).subscribe({
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
            // this.completed = true
          } else if(v[0].orderStatus == 'EM_PREPARACAO'){
            this.activeOrders.set(k,v)
            console.log(this.activeOrders)
            this.active = true;
          } else {
            console.log('Erro')
          }
        })

        if(this.orders.size == 0){
          this.empty = true
        }
        this.hideloader()
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
        if(err.status == 403){
          this.loginService.logout()
        }
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

  showCompleted(){
    this.active = false;
    document.getElementById("completed")?.classList.add('active');
    document.getElementById("active")?.classList.remove('active');
    this.completed = true;
  }

  showActive(){
    this.completed = false;
    document.getElementById("active")?.classList.add('active');
    document.getElementById("completed")?.classList.remove('active');
    this.active = true;
  }

  setImg(id:string){
    return '../../../assets/images/companies/' + id + '.jpg'
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

  filterOrders(evt: any){
    // setTimeout(() => {
      console.log(evt)
      this.empty = false
      this.filter = true
      this.filteredOrders = evt.orders;
    // },300)
    if (this.filteredOrders.size){
    // else this.empty = false
  } else {
    this.empty = true
    if (evt.filterBy == '' || evt.filterBy == null){
      this.filter = false;
      this.empty = false;
      // this.filteredOrders = new Map()
      document.querySelector<HTMLInputElement>('#search')!.value = ''
    // } else {
    //   (this.filteredOrders.size == 0)
    //   this.empty = true;
    }
    }
  }

  hideloader() {
    document.getElementById('loading')!.style.display = 'none';
}
}
