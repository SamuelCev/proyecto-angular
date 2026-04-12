import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { forkJoin } from 'rxjs';
import { Product, Supplier } from '@inven-tech/types';
import { InventoryService } from '../../service/inventory';
import { SuppliersService } from '../../service/suppliers';

@Component({
  selector: 'app-inventory-detail',
  imports: [RouterLink, CurrencyPipe, DatePipe],
  templateUrl: './inventory-detail.html',
  styleUrl: './inventory-detail.css',
})
export class InventoryDetail implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private inventoryService = inject(InventoryService);
  private suppliersService = inject(SuppliersService);

  product = signal<Product | null>(null);
  supplier = signal<Supplier | null>(null);
  loading = signal(true);
  error = signal<string | null>(null);

  ngOnInit(): void {
    // paramMap observable: reacciona a cambios de :id en la URL
    this.route.paramMap.subscribe(params => {
      const id = Number(params.get('id'));
      if (!id || Number.isNaN(id) || id <= 0) {
        this.router.navigate(['/not-found']);
        return;
      }
      this.loadProduct(id);
    });
  }

  private loadProduct(id: number): void {
    this.loading.set(true);
    this.error.set(null);

    forkJoin({
      product: this.inventoryService.getById(id),
      suppliers: this.suppliersService.getAll(),
    }).subscribe({
      next: ({ product, suppliers }) => {
        this.product.set(product);
        this.supplier.set(suppliers.find(s => s.id === product.supplier_id) ?? null);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('No se pudo cargar el producto.');
        this.loading.set(false);
      },
    });
  }

  // Navegación programática de vuelta a la lista
  goBack(): void {
    this.router.navigate(['/inventory']);
  }

  // Navegación programática a edición
  goToEdit(): void {
    const p = this.product();
    if (p) this.router.navigate(['/inventory', p.id, 'edit']);
  }

  // Navegación programática con queryParams — ver productos con stock bajo
  filterLowStock(): void {
    this.router.navigate(['/inventory'], { queryParams: { stock: 'low' } });
  }
}
