import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-not-found',
  imports: [RouterLink],
  templateUrl: './not-found.html',
  styleUrl: './not-found.css',
})
export class NotFound {
  private router = inject(Router);

  // Navegación programática al inicio
  goHome(): void {
    this.router.navigate(['/dashboard']);
  }

  // Navegación programática al inventario
  goToInventory(): void {
    this.router.navigate(['/inventory']);
  }
}
