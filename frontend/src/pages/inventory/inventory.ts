import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-inventory',
  imports: [RouterLink],
  templateUrl: './inventory.html',
  styleUrl: './inventory.css',
})
export class Inventory {
  private router = inject(Router);

  editProductId = signal('');
  editError = signal<string | null>(null);

  setEditProductId(value: string): void {
    this.editProductId.set(value);
    this.editError.set(null);
  }

  goToEditForm(): void {
    const id = Number(this.editProductId().trim());

    if (!Number.isInteger(id) || id <= 0) {
      this.editError.set('Ingresa un ID de producto valido (numero mayor que 0).');
      return;
    }

    this.router.navigate(['/inventory', id, 'edit']);
  }
}
