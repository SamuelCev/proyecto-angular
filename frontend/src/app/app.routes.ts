import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'login', loadComponent: () => import('../pages/login/login').then(m => m.Login) },
  { path: 'dashboard', loadComponent: () => import('../pages/dashboard/dashboard').then(m => m.Dashboard) },
  { path: 'inventory', loadComponent: () => import('../pages/inventory/inventory').then(m => m.Inventory) },
  { path: 'inventory/new', loadComponent: () => import('../pages/inventory-form/inventory-form').then(m => m.InventoryForm) },
  { path: 'inventory/:id/edit', loadComponent: () => import('../pages/inventory-form/inventory-form').then(m => m.InventoryForm) },
  { path: 'suppliers', loadComponent: () => import('../pages/suppliers/suppliers').then(m => m.Suppliers) },
  { path: 'movements', loadComponent: () => import('../pages/movements/movements').then(m => m.Movements) },
  { path: '**', loadComponent: () => import('../pages/not-found/not-found').then(m => m.NotFound) },
];
