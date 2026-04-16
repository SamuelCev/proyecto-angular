import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { forkJoin } from 'rxjs';
import { Product } from '@inven-tech/types';
import { InventoryService } from '../../service/inventory';
import { SuppliersService } from '../../service/suppliers';
import { ToastrService } from 'ngx-toastr';

interface EnrichedProduct extends Product {
  supplierName: string;
}

type StockFilter = 'all' | 'available' | 'low' | 'out';

@Component({
  selector: 'app-inventory',
  imports: [FormsModule, RouterLink, CurrencyPipe],
  templateUrl: './inventory.html',
  styleUrl: './inventory.css',
})
export class Inventory implements OnInit {
  private inventoryService = inject(InventoryService);
  private suppliersService = inject(SuppliersService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private toastr = inject(ToastrService);

  products = signal<EnrichedProduct[]>([]);
  loading = signal(true);
  error = signal<string | null>(null);

  private _searchQuery = signal('');
  get searchQuery(): string { return this._searchQuery(); }
  set searchQuery(value: string) { this._searchQuery.set(value); }

  stockFilter = signal<StockFilter>('all');
  confirmDeleteId = signal<number | null>(null);

  readonly filterOptions: { value: StockFilter; label: string }[] = [
    { value: 'all',       label: 'Todos' },
    { value: 'available', label: 'Disponible' },
    { value: 'low',       label: 'Stock bajo' },
    { value: 'out',       label: 'Sin stock' },
  ];

  filteredProducts = computed(() => {
    const q = this._searchQuery().toLowerCase().trim();
    const filter = this.stockFilter();
    return this.products().filter(p => {
      const stockOk =
        filter === 'all' ||
        (filter === 'out'       && p.stock === 0) ||
        (filter === 'low'       && p.stock > 0 && p.stock <= 5) ||
        (filter === 'available' && p.stock > 5);
      const textOk = !q || p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q);
      return stockOk && textOk;
    });
  });

  ngOnInit(): void {
    this.route.queryParamMap.subscribe(params => {
      const stock = params.get('stock') as StockFilter | null;
      if (stock && ['all', 'available', 'low', 'out'].includes(stock)) {
        this.stockFilter.set(stock);
      }
    });
    this.loadData();
  }

  loadData(): void {
    this.loading.set(true);
    this.error.set(null);
    forkJoin({
      products: this.inventoryService.getAll(),
      suppliers: this.suppliersService.getAll(),
    }).subscribe({
      next: ({ products, suppliers }) => {
        const supplierMap = new Map<number, string>(
          suppliers.map(s => [s.id, s.name])
        );
        this.products.set(
          products.map(p => ({
            ...p,
            supplierName: supplierMap.get(p.supplier_id) || 'Desconocido',
          }))
        );
        this.loading.set(false);
      },
      error: () => {
        this.toastr.error('No se pudieron cargar los productos.', 'Error');
        this.products.set([]);
        this.loading.set(false);
      },
    });
  }

  setFilter(filter: StockFilter): void {
    this.stockFilter.set(filter);
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { stock: filter },
      queryParamsHandling: 'merge',
    });
  }

  viewDetail(id: number): void {
    this.router.navigate(['/inventory', id]);
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
        this.toastr.success('Producto eliminado correctamente.', 'Eliminado');
      },
      error: () => {
        this.toastr.error('No se pudo eliminar el producto.', 'Error');
        this.confirmDeleteId.set(null);
      },
    });
  }
}