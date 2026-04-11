import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { forkJoin } from 'rxjs';
import { Product } from '@inven-tech/types';
import { InventoryService } from '../../service/inventory';
import { SuppliersService } from '../../service/suppliers';

interface EnrichedProduct extends Product {
  supplierName: string;
}

@Component({
  selector: 'app-inventory',
  imports: [CommonModule, FormsModule, RouterLink, CurrencyPipe],
  templateUrl: './inventory.html',
  styleUrl: './inventory.css',
})
export class Inventory implements OnInit {
  private inventoryService = inject(InventoryService);
  private suppliersService = inject(SuppliersService);

  products = signal<EnrichedProduct[]>([]);
  loading = signal(true);
  error = signal<string | null>(null);
  
  searchQuery = signal('');
  confirmDeleteId = signal<number | null>(null);

  filteredProducts = computed(() => {
    const q = this.searchQuery().toLowerCase().trim();
    if (!q) return this.products();
    
    return this.products().filter(p => 
      p.name.toLowerCase().includes(q) ||
      p.sku.toLowerCase().includes(q)
    );
  });

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.loading.set(true);
    this.error.set(null);

    forkJoin({
      products: this.inventoryService.getAll(),
      suppliers: this.suppliersService.getAll()
    }).subscribe({
      next: ({ products, suppliers }) => {
        const supplierMap = new Map<number, string>(
          suppliers.map(s => [s.id, s.name])
        );

        this.products.set(products.map(p => ({
          ...p,
          supplierName: supplierMap.get(p.supplier_id) || 'Desconocido'
        })));
        this.loading.set(false);
      },
      error: () => {
        this.products.set([]);
        this.loading.set(false);
      }
    });
  }

  requestDelete(id: number): void {
    this.confirmDeleteId.set(id);
  }

  cancelDelete(): void {
    this.confirmDeleteId.set(null);
  }

  confirmDelete(): void {
    const id = this.confirmDeleteId();
    if (id === null) return;
    
    this.inventoryService.delete(id).subscribe({
      next: () => {
        this.products.update(list => list.filter(p => p.id !== id));
        this.confirmDeleteId.set(null);
      },
      error: () => {
        this.error.set('No se pudo eliminar el producto.');
        this.confirmDeleteId.set(null);
      }
    });
  }
}
