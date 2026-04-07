import { Routes } from '@angular/router';
import { Login } from '../pages/login/login';
import { Dashboard } from '../pages/dashboard/dashboard';
import { Inventory } from '../pages/inventory/inventory';
import { InventoryForm } from '../pages/inventory-form/inventory-form';
import { Suppliers } from '../pages/suppliers/suppliers';
import { Movements } from '../pages/movements/movements';
import { NotFound } from '../pages/not-found/not-found';

export const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'login', component: Login },
  { path: 'dashboard', component: Dashboard },
  { path: 'inventory', component: Inventory },
  { path: 'inventory/new', component: InventoryForm },
  { path: 'inventory/:id/edit', component: InventoryForm },
  { path: 'suppliers', component: Suppliers },
  { path: 'movements', component: Movements },
  { path: '**', component: NotFound },
];
