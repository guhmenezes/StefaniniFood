import { HttpClient } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { environment } from 'src/environments/environment';
import { AlertModalComponent } from '../components/alert-modal/alert-modal.component';
import { ConfirmModalComponent } from '../components/confirm-modal/confirm-modal.component';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  private userAuth: boolean = false;
  private authURL = environment.API+'login'
  public showMenuEmitter = new EventEmitter<boolean>();

  constructor(private http: HttpClient, private router: Router, private modalService: NgbModal) { }

  login(user: User){
    return this.http.post(this.authURL, user)
    // if (user.user == 'teste' && user.password == '1234'){
    //   this.showMenuEmitter.emit(true);
    //   this.router.navigate(['/']);
    // } else {
      
    // }
  }

  getToken(){
    console.log(localStorage.getItem('token'))
    return localStorage.getItem('token')
  }

  isAuth(){
    if(localStorage.getItem('token')) this.userAuth = true
    else this.userAuth = false;
    return this.userAuth;
  }

  logout(showAlert?: boolean){
    this.userAuth = false;
    localStorage.removeItem('defaultAddress')
    localStorage.removeItem('token')
    if(showAlert)
    this.showConfirmModal().then(() => window.location.pathname = 'entrar', () => window.location.reload())
    else setTimeout(() => window.location.reload(), 2000) 
  }

  showAlertModal(){ 
    const modalRef = this.modalService.open(AlertModalComponent)
    return modalRef.result
  }

  showConfirmModal(){ 
    const modalRef = this.modalService.open(ConfirmModalComponent)
    modalRef.componentInstance.title = "Sessão expirada"
    modalRef.componentInstance.msg = "Deseja fazer login?"
    modalRef.componentInstance.okBtn = "Sim"
    modalRef.componentInstance.cancelBtn = "Não"
    return modalRef.result
  }

}
