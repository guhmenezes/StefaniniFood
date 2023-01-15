import { Component, Input, OnInit } from '@angular/core';
import { Company } from 'src/app/models/company';
import { OrderService } from 'src/app/services/order.service';

@Component({
  selector: 'app-companies',
  templateUrl: './companies.component.html',
  styleUrls: ['./companies.component.css']
})
export class CompaniesComponent implements OnInit {

  @Input()
  searchBy?: string;
  companies:Company[] = [];
  filteredCompanies!: Company[];
  position = 0;
  prevButton = false;
  nextButton = true;
  empty?: boolean = false;
  
  constructor(private service: OrderService) { }

  ngOnInit(): void {
    setTimeout(()=> {
      this.getCompanies()
    },100)

    this.filteredCompanies = this.companies
  }

  getCompanies(){
    this.service.getCompanies().subscribe({
      next: response => {
        if (response){
          this.hideloader()
        }
        Object.values(response).forEach(c => {
          // if(c.products.length > 0)
          this.companies.push(c)
        });
        setTimeout(() => {
          // this.companies.reduce(c => c.products.length > 0)
          // console.log(this.companies[this.companies.length-1].products!.length)
        }, 1000)
      },
      error: err => console.log(err)
    })
  }

  setImg(id:string){
    return '../../../assets/images/companies/' + id + '.jpg'
  }

  hideloader() {
    document.getElementById('loading')!.style.display = 'none';
}

  prev(){
    this.nextButton = true;
    this.prevButton = false;
    this.position += 600
    if(this.position > 0) {
      this.position = 0
    }
    const divCards = document.getElementById('slider')
    divCards!.style.left = `${this.position}px`;

  }

  next(){
    this.nextButton = false;
    this.prevButton = true
    this.position -= 600
    if(this.position < -600){
      this.position = -600
    }
    const divCards = document.getElementById('slider')
    divCards!.style.left = `${this.position}px`;
  }

  filterCompanies(evt: any){
    console.log(evt)
    this.filteredCompanies = evt.companies;
    if (this.filteredCompanies.length <= 3){
      this.prevButton = false;
      this.nextButton = false;
      this.empty = false;
    } else {
      this.nextButton = true
      this.empty = false;
    }
    if (this.filteredCompanies.length == 0){
      if (evt.filterBy == '' || evt.filterBy == null){
        this.empty = false;
        this.filteredCompanies = this.companies;
        document.querySelector<HTMLInputElement>('#search')!.value = ''
      } else {
        this.empty = true;
      }
    } 
  }
}
