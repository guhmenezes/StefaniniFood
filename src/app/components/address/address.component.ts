import { Component, Input, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { LocalService } from 'src/app/services/local.service';
import { Address } from '../../models/address';
import { FormContent, InfoComponent, InfoContent } from './info/info.component';

@Component({
  selector: 'app-address',
  templateUrl: './address.component.html',
  styleUrls: ['./address.component.css']
})
export class AddressComponent implements OnInit {

  @Input()
  addresses:string[] = []
  lat!: number;
  long!: number;
  location:Address = new Address();
  selectDisabled: boolean = false;
//   zipcode?: string;
//   street?: string;
//   number?: string;
//   complement?: string;
//   district?:string;
//   city?: string;
//   uf?: string;

  constructor(private service: LocalService, private modalService: NgbModal) { }

  ngOnInit(): void {
   if(localStorage.getItem('defaultAddress')){
      const address = localStorage.getItem('defaultAddress')
      document.querySelector('#selected')!.textContent = address!.substring(0, address!.indexOf('-'))
      
      setTimeout(() => {
         document.querySelectorAll('button').forEach(b => {
         console.log(b)
         console.log(b.querySelector('.street')?.textContent?.trim())
         console.log(address![0].toUpperCase() + address!.substring(1, address!.indexOf('-')).trim())
         if (b.querySelector('.street')?.textContent?.trim() == address![0].toUpperCase() + address!.substring(1, address!.indexOf('-')).trim()){
            console.log('bingo')
            b.querySelector('.fa-check')?.classList.remove('d-none');
         }
         },500);
      })
   } else if (this.addresses.length == 1){
      localStorage.setItem('defaultAddress', this.addresses[0])
      document.querySelector('#selected')!.textContent = this.addresses[0].substring(0, this.addresses[0]!.indexOf('-'))
      setTimeout(() => {
         document.querySelectorAll('button')[1]?.querySelector('.fa-check')?.classList.remove('d-none')
      }, 500);
   }
  }

  getCurrentLocation() {
   if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(position => {
     this.lat = position.coords.latitude;
     this.long = position.coords.longitude;
     const modalRef = this.modalService.open(InfoContent)
     modalRef.componentInstance.title = 'Este é o seu endereço ?';
     this.service.getAddress(this.lat, this.long).subscribe({
       next: response => {
         try{
           console.log(response.results)
           console.log(response.results[0].formatted_address) // endereço
           for(let i = 0; i< response.results[0].address_components.length; i++){
            console.log(response.results[0].address_components[i].types.includes('country'))
            if (response.results[0].address_components[i].types.includes('street_number')){
               this.location.number = response.results[0].address_components[i].long_name
            }
            if (response.results[0].address_components[i].types.includes('route')){
               this.location.street = response.results[0].address_components[i].short_name
            }
            if (response.results[0].address_components[i].types.includes('sublocality')){
               this.location.district = response.results[0].address_components[i].long_name
            }
            if (response.results[0].address_components[i].types.includes('administrative_area_level_2')){
               this.location.city = response.results[0].address_components[i].long_name
            }
            if (response.results[0].address_components[i].types.includes('administrative_area_level_1')){
               this.location.uf = response.results[0].address_components[i].short_name
            }
            if (response.results[0].address_components[i].types.includes('postal_code')){
               this.location.zipCode = response.results[0].address_components[i].long_name
            }
         }
         let ad = `${this.location.street}, ${this.location.number} - ${this.location.district} \n${this.location.city}-${this.location.uf}, ${this.location.zipCode}`
         console.log(ad)
         this.location.idConsumer = +localStorage.getItem('userId')!;
               modalRef.componentInstance.title = 'Este é  seu endereço ? '
               modalRef.componentInstance.address =  ad
               modalRef.componentInstance.okBtn = 'Sim'
               modalRef.componentInstance.cancelBtn = 'Não'
               modalRef.componentInstance.location = this.location;
         } catch (e) {
            console.log(e)
           modalRef.componentInstance.msg = 'Erro ao carregar sua localização. '
           modalRef.componentInstance.okBtn = 'Fechar'
         }
       },
       error: err => {
         modalRef.componentInstance.msg = 'Erro ao carregar sua localização. '
         modalRef.componentInstance.okBtn = 'Fechar'
       }
     })
    });
   }
  else {
   alert("Geolocation is not supported by this browser.");
   }
  }

  addAddress(){
   let location = new Address();
   const modalRef = this.modalService.open(FormContent, {size: 'lg'})
   modalRef.componentInstance.location = location
  }
  
  getCurrentLocationMock() {
    if (navigator.geolocation) {
     navigator.geolocation.getCurrentPosition(position => {
      this.lat = position.coords.latitude;
      this.long = position.coords.longitude;
      const modalRef = this.modalService.open(InfoContent)
      modalRef.componentInstance.title = 'Este é o seu endereço ?';
      for(let i = 0; i< results[0].address_components.length; i++){
         console.log(results[0].address_components[i].types.includes('country'))
         if (results[0].address_components[i].types.includes('street_number')){
            this.location.number = results[0].address_components[i].long_name
         }
         if (results[0].address_components[i].types.includes('route')){
            this.location.street = results[0].address_components[i].short_name
         }
         if (results[0].address_components[i].types.includes('sublocality')){
            this.location.district = results[0].address_components[i].long_name
         }
         if (results[0].address_components[i].types.includes('administrative_area_level_2')){
            this.location.city = results[0].address_components[i].long_name
         }
         if (results[0].address_components[i].types.includes('administrative_area_level_1')){
            this.location.uf = results[0].address_components[i].short_name
         }
         if (results[0].address_components[i].types.includes('postal_code')){
            this.location.zipCode = results[0].address_components[i].long_name
         }
      }
      let ad = `${this.location.street}, ${this.location.number} - ${this.location.district} \n${this.location.city}-${this.location.uf}, ${this.location.zipCode}`
      console.log(ad)
      this.location.idConsumer = +localStorage.getItem('userId')!;
            modalRef.componentInstance.title = 'Este é  seu endereço ? '
            modalRef.componentInstance.address =  ad
            modalRef.componentInstance.okBtn = 'Sim'
            modalRef.componentInstance.cancelBtn = 'Não'
            modalRef.componentInstance.location = this.location;
     });
    }
   else {
    alert("Geolocation is not supported by this browser.");
    }
   }

   selectAddress(address: string, check: HTMLElement){
      console.log(check)
      document.querySelector('#selected')!.textContent = address.substring(0, address.indexOf('-'))
      document.querySelectorAll('.fa-check').forEach(i => {
         i.classList.add('d-none')
      })
      localStorage.setItem('defaultAddress', address)
      check.classList.remove('d-none')
   }

//   useMyLoc(){
//       this.getCurrentLocation()
//   }
}

const results = [
  {
     "address_components" : [
        {
           "long_name" : "222",
           "short_name" : "221",
           "types" : [ "street_number" ]
        },
        {
           "long_name" : "Rua Doutor Armando D'Otaviano",
           "short_name" : "R. Dr. Armando D'Otaviano",
           "types" : [ "route" ]
        },
        {
           "long_name" : "Jardim Vista Alegre",
           "short_name" : "Jardim Vista Alegre",
           "types" : [ "political", "sublocality", "sublocality_level_1" ]
        },
        {
           "long_name" : "Paulínia",
           "short_name" : "Paulínia",
           "types" : [ "administrative_area_level_2", "political" ]
        },
        {
           "long_name" : "São Paulo",
           "short_name" : "SP",
           "types" : [ "administrative_area_level_1", "political" ]
        },
        {
           "long_name" : "Brasil",
           "short_name" : "BR",
           "types" : [ "country", "political" ]
        },
        {
           "long_name" : "13140-153",
           "short_name" : "13140-153",
           "types" : [ "postal_code" ]
        }
     ],
     "formatted_address" : "R. Dr. Armando D'Otaviano, 221 - Jardim Vista Alegre, Paulínia - SP, 13140-153, Brasil"
    }
  ]