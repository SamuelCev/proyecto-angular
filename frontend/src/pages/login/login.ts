import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  imports: [FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  credentials = {
    email: '',
    password: '',
  };

  submitted = false;
  loginError = false;
  loginSuccess = false;

  onSubmit() {
    this.submitted = true;
    this.loginError = false;
    this.loginSuccess = false;

    if (!this.credentials.email || !this.credentials.password) return;

    // TODO: conectar con auth service
    console.log('Login:', this.credentials);
  }
}