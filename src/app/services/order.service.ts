import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Company } from '../models/company';
import { Coupon } from '../models/coupon';
import { Product } from '../models/product';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  private API_URL = environment.API; 
  private companiesUrl = `${this.API_URL}pedido`
  private productUrl = `${this.companiesUrl}/item/`
  private toDatabaseUrl = `${this.companiesUrl}/itens/`
  private getCartUrl = `${this.companiesUrl}/carrinho/`
  private buyUrl = `${this.companiesUrl}/buy/`
  private clearCartUrl = `${this.companiesUrl}/order/`

  public cart: any[] = [];
  public company:string = '';
  public total: number = 0;
  public deliveryFee: number | string = 0;
  public couponDiscount: number = 10;

  constructor(private http: HttpClient) { }

  getCompanies():Observable<Company>{
    return this.http.get<Company>(this.companiesUrl)
  }

  getCoupons(){
    return coupons;
  }

  getMenu(id:string):Observable<Product>{
    return this.http.get<Product>(this.companiesUrl+'/'+id)
  }

  getCart(id:string):Observable<any>{
    return this.http.get(this.getCartUrl+id)
  }

  getProduct(id:string){
    return this.http.get(this.productUrl+id)
  }

  addProduct(body:any):Observable<any>{
    return this.http.post(this.productUrl, body)
  }

  addToDatabase(body:any[]):Observable<any>{
    return this.http.post(this.toDatabaseUrl, body)
  }

  editProduct(id:number, qty:number):Observable<any>{
    return this.http.put(this.productUrl+`${id}?qty=${qty}`,null)
  }

  deleteProduct(id:string):Observable<any>{
    return this.http.delete(this.getCartUrl+id, {responseType: 'text'})
  }

  confirmOrder(id:string):Observable<any>{
    return this.http.put(this.buyUrl+id, null)
  }

  clearCart(id:string):Observable<any>{
    return this.http.delete(this.clearCartUrl + id)
  }

}

const coupons:Coupon[] = [
  {
  id: '1',
  code: 'PRIMEIRACOMPRA',
  title: 'R$25 para o Primeiro Pedido',
  discountValue: 25,
  validAt: new Date('2022-12-31')
},
{
  id: '2',
  code: 'MENOS10',
  title: 'R$10 para todas as Lojas',
  discountValue: 10,
  validAt: new Date('2022-11-30')
}
]
