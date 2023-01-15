import { Component, Input, OnInit } from '@angular/core';
import {NgbActiveModal, NgbModal} from '@ng-bootstrap/ng-bootstrap';
import { CustomerService } from 'src/app/services/customer.service';
import { Address } from '../../../models/address';

@Component({
  template: `
    <div class="modal-body">
    <div>
      <h1 class="h3 my-4 fw-normal text-center">Cadastrar endereço</h1>
      <form class="row mx-4" #addressForm ="ngForm" (ngSubmit)="saveAddress(addressForm.value)">
        <div class="form-floating mb-3 col-12">
          <input type="text" class="form-control px-4" [(ngModel)]="location.street" name="street" placeholder=" ">
          <label for="floatingInput" class="px-4">Logradouro</label>
        </div>
        <div class="form-floating mb-3 col-6">
          <input type="text" class="form-control px-4" [(ngModel)]="location.number" name="number" placeholder="name@example.com">
          <label for="floatingInput" class="px-4">Número</label>
        </div>
          <div class="form-floating mb-3 col-6">
            <input type="email" class="form-control px-4" name="zipCode" placeholder=" " [(ngModel)]="location.zipCode">
            <label for="floatingInput" class="px-4">CEP</label>
          </div>
          <div class="form-floating mb-3 col-12">
            <input type="text" class="form-control px-4" [(ngModel)]="location.complement" name="complement" placeholder=" ">
            <label for="floatingInput" class="px-4">Complemento</label>
          </div>
          <div class="form-floating mb-3 col-4">
            <input type="text" class="form-control px-4" [(ngModel)]="location.district" name="district" placeholder="name@example.com">
            <label for="floatingInput" class="px-4">Bairro</label>
          </div>
          <div class="form-floating mb-3 col-4">
            <input type="text" class="form-control px-4" [(ngModel)]="location.city" name="city" placeholder="name@example.com">
            <label for="floatingInput" class="px-4">Cidade</label>
          </div>
          <div class="form-floating col-4">
          <select class="form-select px-4" [(ngModel)]="location.uf" id="floatingSelect" aria-label="Floating label select example" name="uf">
            <option value="AC" class="px-4">Acre</option>
            <option value="AL">Alagoas</option>
            <option value="AP">Amapá</option>
            <option value="AM">Amazonas</option>
            <option value="BA">Bahia</option>
            <option value="CE">Ceará</option>
            <option value="DF">Distrito Federal</option>
            <option value="ES">Espírito Santo</option>
            <option value="GO">Goiás</option>
            <option value="MA">Maranhão</option>
            <option value="MT">Mato Grosso</option>
            <option value="MS">Mato Grosso do Sul</option>
            <option value="MG">Minas Gerais</option>
            <option value="PA">Pará</option>
            <option value="PB">Paraíba</option>
            <option value="PR">Paraná</option>
            <option value="PE">Pernambuco</option>
            <option value="PI">Piauí</option>
            <option value="RJ">Rio de Janeiro</option>
            <option value="RN">Rio Grande do Norte</option>
            <option value="RS">Rio Grande do Sul</option>
            <option value="RO">Rondônia</option>
            <option value="RR">Roraima</option>
            <option value="SC">Santa Catarina</option>
            <option value="SP">São Paulo</option>
            <option value="SE">Sergipe</option>
            <option value="TO">Tocantins</option>
          </select>
          <label for="floatingSelect">Estado</label>
          </div>
          <div class="my-3 d-flex justify-content-around col-6 mx-auto">
            <button type="button" class="btn btn-outline-secondary" (click)="close()" style="width: 100px;"> Cancelar </button>
            <button type="submit" class="btn primary-color d-block" style="width: 100px;">Salvar</button>
          </div>
        </form>
    </div>
    <div class="m-3 float-end px-4">
    </div>
    <!-- <i class="fa-regular fa-circle-xmark"></i> -->
  `
})
export class FormContent {
  @Input() msg:any;
  @Input() title:any;
  @Input() location!: Address;

  constructor(public activeModal: NgbActiveModal, private service: CustomerService, private modalService: NgbModal) {}

  saveAddress(form:any){
    console.log(this.location)
    console.log(form)
    form.idConsumer = localStorage.getItem('userId')
    if(this.location.id! > 0) {
      // console.log(form.controls)
      this.service.editAddress(this.location.id!, form).subscribe({
        next: response => {
          this.activeModal.close();
          const modalRef = this.modalService.open(SuccessContent)
          modalRef.componentInstance.title = 'Tudo certo'
          modalRef.componentInstance.msg = 'Endereço atualizado com sucesso.'
          console.log(response)
        },
        error: () => {
          this.activeModal.close();
           const modalRef = this.modalService.open(ErrorContent)
           modalRef.componentInstance.title = 'Ops..'
           modalRef.componentInstance.msg = 'Não foi possível cadastrar este endereço, por favor verifique os dados informados.'
           modalRef.componentInstance.location = this.location;
        }
      })
    } else {
      this.service.addAddress(form).subscribe({
        next: response => {
          this.activeModal.close();
          const modalRef = this.modalService.open(SuccessContent)
          modalRef.componentInstance.title = 'Tudo certo'
          modalRef.componentInstance.msg = 'Endereço cadastrado com sucesso.'
          console.log(response)
        },
        error: () => {
          this.activeModal.close();
           const modalRef = this.modalService.open(ErrorContent)
           modalRef.componentInstance.title = 'Ops..'
           modalRef.componentInstance.msg = 'Não foi possível cadastrar este endereço, por favor verifique os dados informados.'
           modalRef.componentInstance.location = this.location;
        }
      })
    }
  }

  close(){
    this.activeModal.close();
  }

}

@Component({
  template: `
    <div class="modal-body">
    <i class="text-center fa-regular fa-circle-check primary-text-color w-100 fs-1 my-3"></i>
      <h5 class="text-center my-3">{{title}}</h5>
      <p class="text-center my-3">{{msg}}</p>
    </div>
    <div class="m-3 float-end px-4">
    <button type="button" class="btn primary-color" (click)="confirm(0)">OK</button>
    </div>
    <!-- <i class="fa-regular fa-circle-xmark"></i> -->
  `
})
export class SuccessContent implements OnInit{
  @Input() msg:any;
  @Input() title:any;

  constructor(public activeModal: NgbActiveModal, private service: CustomerService, private modalService: NgbModal) {}
  
  ngOnInit(): void {
    this.confirm(3000);  
  }

  confirm(time: number){
    setTimeout(() => {
      window.location.reload();
    }, time)
  }
}

@Component({
  template: `
    <div class="modal-body">
    <i class="text-center fa-solid fa-circle-exclamation text-warning w-100 fs-1 my-3"></i>
      <h5 class="text-center my-3">{{title}}</h5>
      <p class="text-center my-3">{{msg}}</p>
    </div>
    <div class="m-3 float-end px-4">
    <button type="button" class="btn btn-outline-secondary" (click)="select()">Não</button>
    <button type="button" class="btn primary-color" (click)="edit()">Sim, editar</button>
    </div>
  `
})
export class AlertContent{
  @Input() msg:any;
  @Input() title:any;
  @Input() location!: Address;
 
  constructor(public activeModal: NgbActiveModal, private service: CustomerService, private modalService: NgbModal) {}

  edit(){
      this.activeModal.dismiss();
      const modalRef = this.modalService.open(FormContent, {size: 'lg'})
      modalRef.componentInstance.location = this.location;
  }

  select(){
    this.activeModal.dismiss();
    document.querySelector('#addresses')?.querySelectorAll('button').forEach(b=> {
      let loc = `${this.location.street}, ${this.location.number}`
      b.querySelectorAll('.fa-check').forEach(i => {
        i.classList.add('d-none')
     })      
      if(b.querySelector('.street')?.textContent?.trim() == loc){
        document.querySelector('#selected')!.textContent = loc
        b.querySelector('.fa-check')?.classList.remove('d-none');
        localStorage.setItem('defaultAddress', loc + ' -')
      }
      // console.log(loc)
      // console.log(b.querySelector('.street')?.textContent?.trim())
    })
  }
}

@Component({
  template: `
    <div class="modal-body">
    <i class="text-center fa-regular fa-circle-xmark text-danger w-100 fs-1 my-3"></i>
      <h5 class="text-center my-3">{{title}}</h5>
      <p class="text-center my-3">{{msg}}</p>
    </div>
    <div class="m-3 float-end px-4">
    <button type="button" class="btn btn-danger" (click)="confirm()">Tentar novamente</button>
    </div>
  `
})
export class ErrorContent{
  @Input() msg:any;
  @Input() title:any;
  @Input() location!: Address;
 
  constructor(public activeModal: NgbActiveModal, private service: CustomerService, private modalService: NgbModal) {}

  confirm(){
      this.activeModal.dismiss();
      const modalRef = this.modalService.open(FormContent, {size: 'lg'})
      modalRef.componentInstance.location = this.location;
  }
}

@Component({
  template: `
    <div class="modal-header">
      <h4 class="modal-title">{{title}}</h4>
      <span class="btn-close" (click)="activeModal.dismiss('Cross click')"></span>
    </div>
    <div class="modal-body">
      <p class="h4">{{msg}}</p>
      <p class="text-center mb-4">{{address}}</p>
      <form>

        <div *ngIf="comp.checked" class="form-floating mb-3 col-11 mx-3">
          <input type="text" class="form-control px-4" [(ngModel)]="location.complement" name="complement" placeholder=" ">
          <label for="floatingInput" class="px-3">Complemento</label>
        </div>
        <div class="opt mx-auto my-3" style="width: 55%; padding-left: 10px;">
          <input type="checkbox" checked> <label class="mx-2">Salvar este endereço</label><br>
          <input type="checkbox" #comp> <label class="mx-2">Desejo informar complemento</label>
        </div>
        <div class="modal-footer d-flex justify-content-around px-5">
          <button type="button" class="btn btn-outline-secondary" (click)="editAddress()">{{cancelBtn}}</button>
          <button type="submit" class="btn primary-color" (click)="saveAddress()">{{okBtn}}</button>
        </div>
        </form>
      </div>
  `
})
export class InfoContent {
  @Input() msg:any;
  @Input() title:any;
  @Input() address:any;
  @Input() okBtn:any;
  @Input() cancelBtn:any;
  @Input() location!:Address;

  constructor(public activeModal: NgbActiveModal, private service: CustomerService, private modalService: NgbModal) {}
  
  saveAddress(){
      this.service.addAddress(this.location).subscribe({
        next: response => {
          this.activeModal.close();
          const modalRef = this.modalService.open(SuccessContent)
          modalRef.componentInstance.title = 'Tudo certo'
          modalRef.componentInstance.msg = 'Endereço cadastrado com sucesso.'
          console.log(response)
        },
        error: err => {
          this.activeModal.close();
          if (err.status == 422){
            console.log(err.error)
            const modalRef = this.modalService.open(AlertContent)
            modalRef.componentInstance.title = 'Nada mau'
            modalRef.componentInstance.msg = 'O endereço informado já está cadastrado. Deseja editá-lo?'
            this.location.id = err.error
            modalRef.componentInstance.location = this.location;
          } else {
            console.log(err)
             const modalRef = this.modalService.open(ErrorContent)
             modalRef.componentInstance.title = 'Ops..'
             modalRef.componentInstance.msg = 'Não foi possível cadastrar este endereço, por favor verifique os dados informados.'
             modalRef.componentInstance.location = this.location;
          }
        }
      })
  }

  editAddress(){
    this.activeModal.dismiss();
    const modalRef = this.modalService.open(FormContent, {size: 'lg'})
    modalRef.componentInstance.location = this.location;
  }
}

@Component({templateUrl: './info.component.html'})
export class InfoComponent implements OnInit {
  constructor(private modalService: NgbModal) {}

  ngOnInit(): void {
    document.addEventListener('keypress', (k) => {
      if (k.key === 'Escape'){
        this.modalService.dismissAll()
        window.location.reload()
      }
    }) 
    if (!this.modalService.hasOpenModals) {
      window.location.reload()
    }
  }

  open() {
    const modalRef = this.modalService.open(InfoComponent);
    modalRef.componentInstance.msg = '';
    modalRef.componentInstance.title = '';
    modalRef.componentInstance.txtBtn = 'OK';
  }

}