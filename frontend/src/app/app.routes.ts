import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';
import { publicGuard } from './guards/public.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'login', canActivate: [publicGuard], loadComponent: () => import('../pages/login/login').then(m => m.Login) },
  { path: 'dashboard', canActivate: [authGuard], loadComponent: () => import('../pages/dashboard/dashboard').then(m => m.Dashboard) },
  { path: 'inventory', canActivate: [authGuard], loadComponent: () => import('../pages/inventory/inventory').then(m => m.Inventory) },
  { path: 'inventory/new', canActivate: [authGuard], loadComponent: () => import('../pages/inventory-form/inventory-form').then(m => m.InventoryForm) },
  { path: 'inventory/:id/edit', canActivate: [authGuard], loadComponent: () => import('../pages/inventory-form/inventory-form').then(m => m.InventoryForm) },
  { path: 'suppliers', canActivate: [authGuard], loadComponent: () => import('../pages/suppliers/suppliers').then(m => m.Suppliers) },
  { path: 'movements', canActivate: [authGuard], loadComponent: () => import('../pages/movements/movements').then(m => m.Movements) },
  { path: '**', loadComponent: () => import('../pages/not-found/not-found').then(m => m.NotFound) },
];
