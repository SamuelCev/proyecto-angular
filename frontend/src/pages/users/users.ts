import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UsersService } from '../../service/users';
import type { User } from '@inven-tech/types';

type UserRole = 'ADMIN' | 'EMPLOYEE';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './users.html',
  styleUrl: './users.css',
})
export class Users implements OnInit {
  users = signal<User[]>([]);
  loading = signal(false);
  error = signal('');
  success = signal('');

  formData = {
    name: '',
    email: '',
    password: '',
    role: 'EMPLOYEE' as UserRole,
  };

  formSubmitted = signal(false);

  constructor(private usersService: UsersService) {}

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    this.loading.set(true);
    this.error.set('');
    this.usersService.getAll().subscribe({
      next: (data) => {
        this.users.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set('Error al cargar los usuarios');
        console.error(err);
        this.loading.set(false);
      },
    });
  }

  private resetForm() {
    this.formData = {
      name: '',
      email: '',
      password: '',
      role: 'EMPLOYEE',
    };
    this.formSubmitted.set(false);
  }

  onSubmit() {
    this.formSubmitted.set(true);
    this.error.set('');
    this.success.set('');

    const name = this.formData.name.trim();
    const email = this.formData.email.trim();
    const password = this.formData.password.trim();

    if (!name || !email || !password || !this.formData.role) {
      return;
    }

    const exists = this.users().some(user => user.email.toLowerCase() === email.toLowerCase());
    if (exists) {
      this.error.set('El correo ya está registrado. Usa otro correo.');
      return;
    }

    this.formData = {
      ...this.formData,
      name,
      email,
      password,
    };

    this.createUser();
  }

  private createUser() {
    const newUser = {
      name: this.formData.name,
      email: this.formData.email,
      password: this.formData.password,
      role: this.formData.role,
    };

    this.loading.set(true);
    this.usersService.create(newUser).subscribe({
      next: () => {
        this.success.set('Usuario creado correctamente');
        this.loading.set(false);
        this.resetForm();
        this.loadUsers();
      },
      error: (err) => {
        this.error.set(this.getApiErrorMessage(err, 'Error al crear el usuario'));
        console.error(err);
        this.loading.set(false);
      },
    });
  }

  deleteUser(userId: number) {
    this.error.set('');
    this.success.set('');

    const confirmed = confirm('¿Seguro que deseas dar de baja este usuario?');
    if (!confirmed) {
      return;
    }

    this.loading.set(true);
    this.usersService.delete(userId).subscribe({
      next: () => {
        this.success.set('Usuario dado de baja correctamente');
        this.loading.set(false);
        this.loadUsers();
      },
      error: (err) => {
        this.error.set(this.getApiErrorMessage(err, 'Error al dar de baja el usuario'));
        console.error(err);
        this.loading.set(false);
      },
    });
  }

  private getApiErrorMessage(err: any, fallback: string): string {
    const duplicateRaw = String(err?.error?.error || '').toLowerCase();
    if (duplicateRaw.includes('duplicate entry') && duplicateRaw.includes('users.email')) {
      return 'El correo ya está registrado. Usa otro correo.';
    }

    if (err?.error?.errors?.length && err.error.errors[0]?.message) {
      return err.error.errors[0].message;
    }

    return err?.error?.message || err?.error?.error || fallback;
  }
}
