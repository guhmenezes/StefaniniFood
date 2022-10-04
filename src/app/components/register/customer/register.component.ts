import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RegisterService } from 'src/app/services/register.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  registerForm: FormGroup;

  constructor(private fb: FormBuilder, private service: RegisterService) { 
    this.registerForm = this.fb.group({
      cpf: '',
      password: '',
      confirmPass: '',
      name: '',
      email: '',
      phone: ''
    })
  };

  ngOnInit(): void {
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


}
