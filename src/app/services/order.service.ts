import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Company } from '../models/company';
import { Product } from '../models/product';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  private API_URL = environment.API; 
  private companiesUrl = `${this.API_URL}pedido/`
  private addProductUrl = `${this.companiesUrl}item/`
  private getCartUrl = `${this.companiesUrl}carrinho/`
  private buyUrl = `${this.companiesUrl}buy/`

  public cart: any[] = [];
  public company:string = '';
  public total: number = 0;
  public deliveryFee: number | string = 0;
  public couponDiscount: number = 10;

  constructor(private http: HttpClient) { }

  getCompanies():Observable<Company>{
    return this.http.get<Company>(this.companiesUrl)
  }

  getMenu(id:string):Observable<Product>{
    return this.http.get<Product>(this.companiesUrl+id)
  }

  getCart(id:string):Observable<any>{
    return this.http.get(this.getCartUrl+id)
  }

  addProduct(body:any):Observable<any>{
    return this.http.post(this.addProductUrl, body)
  }

  deleteProduct(id:string):Observable<any>{
    return this.http.delete(this.getCartUrl+id, {responseType: 'text'})
  }

  confirmOrder(id:string):Observable<any>{
    return this.http.put(this.buyUrl+id, null)
  }

  // retrieveProductsOnCart(){
  //   this.getCart('229').subscribe({
  //     next: response => {
  //       if(this.cart.length > 0){
  //         this.cart = []
  //       }
  //       Object.values(response).forEach(p => {
  //         this.cart.push(p)
  //         this.sumItems()
  //       });
  //       this.company = this.cart[0].company
  //     },
  //     error: err => console.log(err)
  //   })
  //   return this.cart, this.total
  // }

  // sumItems(){
  //   this.cart.forEach((i) => {
  //     this.total += i.total
  //   })
  //   console.log(this.total)
  //   return this.total
  // }
}
