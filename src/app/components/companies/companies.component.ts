import { Component, OnInit } from '@angular/core';
import { OrderService } from 'src/app/services/order.service';

@Component({
  selector: 'app-companies',
  templateUrl: './companies.component.html',
  styleUrls: ['./companies.component.css']
})
export class CompaniesComponent implements OnInit {

  companies:any[] = []

  constructor(private service: OrderService) { }

  ngOnInit(): void {
    this.getCompanies()
  }

  getCompanies(){
    this.service.getCompanies().subscribe({
      next: response => {
        Object.values(response).forEach(c => {
          this.companies.push(c)
        });
      }
    })
  }

}
