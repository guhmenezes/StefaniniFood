import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { RegisterService } from 'src/app/services/register.service';

@Component({
  selector: 'app-register-partner',
  templateUrl: './register-partner.component.html',
  styleUrls: ['./register-partner.component.css']
})
export class RegisterPartnerComponent implements OnInit {

  registerForm: FormGroup;

  constructor(private fb: FormBuilder, private service: RegisterService) { 
    this.registerForm = this.fb.group({
      cnpj: '',
      password: '',
      confirmPass: '',
      name: '',
      email: '',
      phone: ''
    })
  };

  ngOnInit(): void {
  }

  createCompany(){
    
    let body = this.registerForm.value;
    this.service.createCompany(body).subscribe({
      next: response => {
        console.log(response)
      },
      error: response => {
        console.log(response) 
      }
    })
    console.log(body);
  }
}
