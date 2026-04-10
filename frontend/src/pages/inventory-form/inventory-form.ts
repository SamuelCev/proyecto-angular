/*import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Product, Supplier } from '@inven-tech/types';
import { InventoryService } from '../../service/inventory';
import { SuppliersService } from '../../service/suppliers';

@Component({
  selector: 'app-inventory-form',
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './inventory-form.html',
  styleUrl: './inventory-form.css',
})
export class InventoryForm implements OnInit {
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private inventoryService = inject(InventoryService);
  private suppliersService = inject(SuppliersService);

  loading = signal(true);
  saving = signal(false);
  error = signal<string | null>(null);
  mode = signal<'create' | 'edit'>('create');
  editId = signal<number | null>(null);
  suppliers = signal<Supplier[]>([]);

  createForm = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(150)]],
    sku: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
    description: [''],
    price: [0, [Validators.required, Validators.min(0)]],
    stock: [0, [Validators.required, Validators.min(0)]],
    supplier_id: [null as number | null, [Validators.required, Validators.min(1)]],
  });

  editForm = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(150)]],
    sku: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
    description: [''],
    price: [0, [Validators.required, Validators.min(0)]],
    stock: [0, [Validators.required, Validators.min(0)]],
    supplier_id: [null as number | null, [Validators.required, Validators.min(1)]],
  });

  ngOnInit(): void {
    this.suppliersService.getAll().subscribe({
      next: (data) => this.suppliers.set(data),
      error: () => {
        this.error.set('Error al cargar los proveedores.');
      },
    });

    const idParam = this.route.snapshot.paramMap.get('id');
    const id = idParam ? Number(idParam) : NaN;

    if (!Number.isNaN(id) && id > 0) {
      this.mode.set('edit');
      this.editId.set(id);
      this.loadProduct(id);
      return;
    }

    this.mode.set('create');
    this.loading.set(false);
  }

  saveCreate(): void {
    if (this.createForm.invalid) {
      this.createForm.markAllAsTouched();
      return;
    }

    const payload = this.toPayload(this.createForm.getRawValue());
    this.saving.set(true);
    this.error.set(null);

    this.inventoryService.create(payload).subscribe({
      next: () => {
        this.saving.set(false);
        this.router.navigate(['/inventory']);
      },
      error: () => {
        this.error.set('No se pudo crear el producto.');
        this.saving.set(false);
      },
    });
  }

  saveEdit(): void {
    if (this.editForm.invalid || this.editId() === null) {
      this.editForm.markAllAsTouched();
      return;
    }

    const payload = this.toPayload(this.editForm.getRawValue());
    this.saving.set(true);
    this.error.set(null);

    this.inventoryService.update(this.editId()!, payload).subscribe({
      next: () => {
        this.saving.set(false);
        this.router.navigate(['/inventory']);
      },
      error: () => {
        this.error.set('No se pudo actualizar el producto.');
        this.saving.set(false);
      },
    });
  }

  controlInvalid(
    formType: 'create' | 'edit',
    controlName: 'name' | 'sku' | 'description' | 'price' | 'stock' | 'supplier_id'
  ): boolean {
    const control = this.getControl(formType, controlName);
    return !!control && control.invalid && control.touched;
  }

  hasError(
    formType: 'create' | 'edit',
    controlName: 'name' | 'sku' | 'description' | 'price' | 'stock' | 'supplier_id',
    errorCode: string
  ): boolean {
    const control = this.getControl(formType, controlName);
    return !!control && control.hasError(errorCode) && control.touched;
  }

  private loadProduct(id: number): void {
    this.loading.set(true);
    this.error.set(null);

    this.inventoryService.getById(id).subscribe({
      next: (product) => {
        this.patchEditForm(product);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('No se pudo cargar el producto para editar.');
        this.loading.set(false);
      },
    });
  }

  private patchEditForm(product: Product): void {
    this.editForm.patchValue({
      name: product.name,
      sku: product.sku,
      description: product.description ?? '',
      price: product.price,
      stock: product.stock,
      supplier_id: product.supplier_id,
    });
  }

  private toPayload(formValue: {
    name: string | null;
    sku: string | null;
    description: string | null;
    price: number | null;
    stock: number | null;
    supplier_id: number | null;
  }): Omit<Product, 'id' | 'created_at' | 'updated_at'> {
    return {
      name: (formValue.name ?? '').trim(),
      sku: (formValue.sku ?? '').trim(),
      description: (formValue.description ?? '').trim() || undefined,
      price: Number(formValue.price ?? 0),
      stock: Number(formValue.stock ?? 0),
      supplier_id: Number(formValue.supplier_id ?? 0),
    };
  }

  private getControl(
    formType: 'create' | 'edit',
    controlName: 'name' | 'sku' | 'description' | 'price' | 'stock' | 'supplier_id'
  ) {
    return formType === 'create'
      ? this.createForm.controls[controlName]
      : this.editForm.controls[controlName];
  }
}
