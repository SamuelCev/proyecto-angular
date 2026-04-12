import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Auth } from '../../service/auth';

type AuthMode = 'login' | 'register';

@Component({
  selector: 'app-login',
  imports: [FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  loginData = {
    email: '',
    password: '',
  };

  registerData = {
    name: '',
    email: '',
    password: '',
    role: 'EMPLOYEE' as 'ADMIN' | 'EMPLOYEE',
  };

  mode = signal<AuthMode>('login');

  submitted = signal(false);
  loginError = signal(false);
  loginSuccess = signal(false);
  feedbackMessage = signal('');

  constructor(private auth: Auth, private router: Router) {}

  switchMode(mode: AuthMode) {
    this.mode.set(mode);
    this.submitted.set(false);
    this.loginError.set(false);
    this.loginSuccess.set(false);
    this.feedbackMessage.set('');
  }

  onSubmit() {
    this.submitted.set(true);
    this.loginError.set(false);
    this.loginSuccess.set(false);
    this.feedbackMessage.set('');

    if (this.mode() === 'login') {
      this.onLoginSubmit();
      return;
    }

    this.onRegisterSubmit();
  }

  private onLoginSubmit() {
    if (!this.loginData.email || !this.loginData.password) return;

    this.auth.login(this.loginData.email, this.loginData.password).subscribe({
      next: () => {
        this.loginSuccess.set(true);
        this.feedbackMessage.set(`Bienvenido, ${this.loginData.email}!`);
        this.auth.loadUser();
        this.router.navigate(['/']);
      },
      error: (err) => {
        this.loginError.set(true);
        this.feedbackMessage.set(err?.error?.message || 'Favor de revisar tu correo o contraseña.');
        console.error('Error en el login:', err);
      },
    });
  }

  private onRegisterSubmit() {
    const { name, email, password, role } = this.registerData;
    if (!name || !email || !password || !role) return;

    this.auth.register({ name, email, password, role }).subscribe({
      next: () => {
        this.loginSuccess.set(true);
        this.feedbackMessage.set(`Usuario ${name} registrado correctamente.`);
        this.auth.loadUser();
        this.router.navigate(['/']);
      },
      error: (err) => {
        this.loginError.set(true);
        this.feedbackMessage.set(err?.error?.message || 'No se pudo completar el registro.');
        console.error('Error en el registro:', err);
      },
    });
  }
}