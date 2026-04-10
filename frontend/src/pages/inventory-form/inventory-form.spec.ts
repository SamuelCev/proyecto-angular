import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { InventoryForm } from './inventory-form';
import { InventoryService } from '../../service/inventory';
import { SuppliersService } from '../../service/suppliers';

describe('InventoryForm', () => {
  let component: InventoryForm;
  let fixture: ComponentFixture<InventoryForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InventoryForm],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: {
                get: () => null,
              },
            },
          },
        },
        {
          provide: InventoryService,
          useValue: {
            getById: () => of({
              id: 1,
              name: 'Producto prueba',
              sku: 'SKU-001',
              description: '',
              price: 10,
              stock: 5,
              supplier_id: 1,
            }),
            create: () => of({
              id: 1,
              name: 'Producto prueba',
              sku: 'SKU-001',
              description: '',
              price: 10,
              stock: 5,
              supplier_id: 1,
            }),
            update: () => of({ message: 'ok' }),
          },
        },
        {
          provide: SuppliersService,
          useValue: {
            getAll: () => of([]),
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(InventoryForm);
    component = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
