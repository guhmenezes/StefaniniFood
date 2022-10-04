import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http'
import { Customer } from '../models/customer';
import { Observable } from 'rxjs';
import { Company } from '../models/company';

@Injectable({
  providedIn: 'root'
})
export class RegisterService {

  private API_URL = environment.API; 
  private createCustomerUrl = `${this.API_URL}cadastro`;
  private createCompanyUrl = `${this.API_URL}empresa`;

  constructor(private http: HttpClient) { }

  createCustomer(customer: Customer): Observable<any>{
    return this.http.post(this.createCustomerUrl, customer);
  }

  createCompany(company: Company): Observable<any>{
    return this.http.post(this.createCompanyUrl, company);
  }
}
