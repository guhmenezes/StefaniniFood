import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { User } from 'src/app/models/user';
import { LoginService } from 'src/app/services/login.service';

@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.css']
})
export class CustomerLoginComponent implements OnInit {

  user = new User();

  constructor(private service: LoginService, protected router: Router) { }

  ngOnInit(): void {
    if(this.service.isAuth()) this.router.navigate(['/'])
    else this.service.showMenuEmitter.emit(false);
  }

  login(form: NgForm){
    this.service.login(this.user).subscribe({
      next: (response:any) => {
        localStorage.setItem('token', response.token)
        localStorage.setItem('user', response.id)
        this.service.isAuth
        console.log(response)
        this.service.showMenuEmitter.emit(true);
        this.router.navigate([''])
      },
      error: () => {
        alert('Usuário e/ou senha inválidos !')
      }
    })
  }

  register(){
    this.router.navigate(['cadastro'])
  }
}
