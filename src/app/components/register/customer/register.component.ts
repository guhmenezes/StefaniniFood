import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginService } from 'src/app/services/login.service';
import { RegisterService } from 'src/app/services/register.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  registerForm: FormGroup;
  step2: boolean = false;
  // history_api = typeof history.pushState !== 'undefined'

  constructor(private fb: FormBuilder, private service: RegisterService, private loginService: LoginService, protected router: Router) { 
    this.registerForm = this.fb.group({
      cpf: ['', Validators.required],
      password: ['', Validators.required],
      confirmPass: ['', Validators.required],
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
    })
  };

  ngOnInit(): void {
    this.loginService.showMenuEmitter.emit(false);
    // window.location.hash = '#no-back'
    // if ( window.location.hash == '#no-back' ) { 
		// 	if ( this.history_api ){ 
		// 		history.pushState(null, '', '#BLOQUEIO'); 
    //   }
    // }
  }

  createCustomer(){
    
    let body = this.registerForm.value;
    this.service.createCustomer(body).subscribe({
      next: response => {
        console.log(response)
      },
      error: () => {
        console.log('Erro') 
      }
    })
    console.log(body);
  }

  toStep2(){
    if(this.registerForm.get('email')?.invalid || this.registerForm.get('password')?.invalid || this.registerForm.get('confirmPass')?.invalid){
    } else {
      this.step2 = true;
    }
  }

  back(){
    if(this.step2) {
      this.step2 = false
    } else this.router.navigate(['/entrar'])
  }
}
