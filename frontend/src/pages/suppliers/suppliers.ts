import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Supplier } from '@inven-tech/types';
import { SuppliersService } from '../../service/suppliers';

@Component({
  selector: 'app-suppliers',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './suppliers.html',
  styleUrl: './suppliers.css',
})
export class Suppliers implements OnInit {
  private suppliersService = inject(SuppliersService);
  private fb = inject(FormBuilder);

  suppliers = signal<Supplier[]>([]);
  loading = signal(true);
  error = signal<string | null>(null);
  showModal = signal(false);
  editingId = signal<number | null>(null);
  confirmDeleteId = signal<number | null>(null);

  searchQuery = signal('');

  filteredSuppliers = computed(() => {
    const q = this.searchQuery().toLowerCase().trim();
    if (!q) return this.suppliers();
    return this.suppliers().filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        (s.email ?? '').toLowerCase().includes(q) ||
        (s.phone ?? '').toLowerCase().includes(q)
    );
  });

  // FormBuilder + Validators — formulario alta/edición con límites estrictos
  form = this.fb.group({
    name: ['', [
      Validators.required,
      Validators.minLength(2),
      Validators.maxLength(100),
      Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ0-9\s\.,&'-]+$/)
    ]],
    email: ['', [Validators.email, Validators.maxLength(150)]],
    phone: ['', [
      Validators.required,
      Validators.pattern(/^[0-9\+\-\s\(\)]{10,20}$/)
    ]],
    address: ['', [Validators.required, Validators.maxLength(250)]],
  });

  ngOnInit(): void {
    this.loadSuppliers();
  }

  restrictPhone(event: Event): void {
    const input = event.target as HTMLInputElement;
    const sanitized = input.value.replace(/[^0-9\+\-\s\(\)]/g, '');
    if (input.value !== sanitized) {
      input.value = sanitized;
      this.form.controls.phone.setValue(sanitized, { emitEvent: false });
    }
  }

  loadSuppliers(): void {
    this.loading.set(true);
    this.error.set(null);
    this.suppliersService.getAll().subscribe({
      next: (data) => {
        this.suppliers.set(data);
        this.loading.set(false);
      },
      error: () => {
        this.suppliers.set([]);
        this.loading.set(false);
      },
    });
  }

  openCreate(): void {
    this.editingId.set(null);
    this.form.reset();
    this.showModal.set(true);
  }

  openEdit(supplier: Supplier): void {
    this.editingId.set(supplier.id);
    this.form.setValue({
      name: supplier.name,
      email: supplier.email ?? '',
      phone: supplier.phone ?? '',
      address: supplier.address ?? '',
    });
    this.showModal.set(true);
  }

  closeModal(): void {
    this.showModal.set(false);
    this.form.reset();
    this.editingId.set(null);
  }

  save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const payload = {
      name: this.form.value.name!,
      email: this.form.value.email || undefined,
      phone: this.form.value.phone!,
      address: this.form.value.address!,
    };

    if (this.editingId() === null) {
      this.suppliersService.create(payload).subscribe({
        next: (created) => {
          this.suppliers.update((list) => [...list, created]);
          this.closeModal();
        },
        error: () => {
          this.error.set('Error al crear el proveedor.');
        },
      });
    } else {
      const id = this.editingId()!;
      this.suppliersService.update(id, payload).subscribe({
        next: () => {
          this.suppliers.update((list) =>
            list.map((s) => (s.id === id ? { ...s, ...payload } : s))
          );
          this.closeModal();
        },
        error: () => {
          this.error.set('Error al actualizar el proveedor.');
        },
      });
    }
  }

  requestDelete(id: number): void {
    this.confirmDeleteId.set(id);
  }

  cancelDelete(): void {
    this.confirmDeleteId.set(null);
  }

  confirmDelete(): void {
    if (this.confirmDeleteId() === null) return;
    const id = this.confirmDeleteId()!;
    this.suppliersService.delete(id).subscribe({
      next: () => {
        this.suppliers.update((list) => list.filter((s) => s.id !== id));
        this.confirmDeleteId.set(null);
      },
      error: () => {
        this.error.set('Error al eliminar el proveedor.');
        this.confirmDeleteId.set(null);
      },
    });
  }
}
