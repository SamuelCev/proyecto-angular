import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Auth } from '../../service/auth';

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

  submitted = signal(false);
  loginError = signal(false);
  loginSuccess = signal(false);

  constructor(private auth: Auth, private router: Router) {}

  onSubmit() {
    this.submitted.set(true);
    this.loginError.set(false);
    this.loginSuccess.set(false);

    if (!this.credentials.email || !this.credentials.password) return;

    this.auth.login(this.credentials.email, this.credentials.password).subscribe({
      next: () => {
        this.loginSuccess.set(true);
        this.auth.loadUser();
        // Redirige al dashboard o página principal tras iniciar sesión
        this.router.navigate(['/']);
      },
      error: (err) => {
        this.loginError.set(true);
        console.error('Error en el login:', err);
      }
    });
  }
}