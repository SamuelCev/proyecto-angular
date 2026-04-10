import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { forkJoin } from 'rxjs';
import { Product, Movement, Supplier } from '@inven-tech/types';
import { InventoryService } from '../../service/inventory';
import { MovementsService } from '../../service/movements';
import { SuppliersService } from '../../service/suppliers';

interface EnrichedMovement extends Movement {
  productName: string;
}

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, CurrencyPipe, DatePipe],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard implements OnInit {
  private inventoryService = inject(InventoryService);
  private movementsService = inject(MovementsService);
  private suppliersService = inject(SuppliersService);

  loading = signal(true);
  error = signal<string | null>(null);

  totalProducts = signal(0);
  totalStockValue = signal(0);
  totalSuppliers = signal(0);
  lowStockProducts = signal<Product[]>([]);
  outOfStockProducts = signal<Product[]>([]);
  recentMovements = signal<EnrichedMovement[]>([]);

  ngOnInit(): void {
    forkJoin({
      products: this.inventoryService.getAll(),
      movements: this.movementsService.getAll(),
      suppliers: this.suppliersService.getAll(),
    }).subscribe({
      next: ({ products, movements, suppliers }) => {
        this.totalProducts.set(products.length);
        this.totalStockValue.set(
          products.reduce((acc, p) => acc + p.price * p.stock, 0)
        );
        this.totalSuppliers.set(suppliers.length);
        this.lowStockProducts.set(
          products.filter((p) => p.stock > 0 && p.stock <= 5)
        );
        this.outOfStockProducts.set(
          products.filter((p) => p.stock === 0)
        );

        const productMap = new Map<number, string>(
          products.map((p) => [p.id, p.name])
        );
        this.recentMovements.set(
          movements.slice(0, 5).map((m) => ({
            ...m,
            productName: productMap.get(m.product_id) ?? `Producto #${m.product_id}`,
          }))
        );

        this.loading.set(false);
      },
      error: (err) => {
        this.error.set('Error al cargar los datos del dashboard.');
        this.loading.set(false);
        console.error(err);
      },
    });
  }
}
