import { Component, inject, signal } from '@angular/core';
import { Auth } from '../../service/auth';

@Component({
  selector: 'app-header',
  imports: [],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {
  private readonly auth = inject(Auth);
  readonly user = this.auth.user;
  readonly dropdownOpen = signal(false);

  toggleDropdown() {
    this.dropdownOpen.update(v => !v);
  }

  logout() {
    this.dropdownOpen.set(false);
    this.auth.logout();
  }
}
