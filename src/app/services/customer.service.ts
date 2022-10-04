import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {

  private API_URL = environment.API
  private customerInfoUrl = this.API_URL+'usuario/'
  private ordersUrl = this.customerInfoUrl+'pedidos/'

  constructor(private http:HttpClient) { }

  getCustomerInfo(cpf:string):Observable<any>{
    return this.http.get(this.customerInfoUrl+cpf)
  }

  getOrders(id:string):Observable<any>{
    return this.http.get(this.ordersUrl+id)
  }
  
}
