// src/app/app.routes.ts
import { Routes } from '@angular/router';
import { validarTokenGuard, validarTokenGuard2 } from './guards/validar-token.guard';

export const routes: Routes = [
  {
    path: 'catalogo',
    loadChildren: () => import('./catalog/catalog.module').then(m => m.CatalogModule),
    canActivate:[validarTokenGuard],
    canMatch: [validarTokenGuard2]
  },
  {
    path: 'stock',
    loadChildren: () => import('./stock/stock.module').then(m => m.StockModule),
    canActivate:[validarTokenGuard],
    canActivateChild: [validarTokenGuard], // 👈
    canMatch: [validarTokenGuard2]
  },
  {
    path: 'tienda',
    loadChildren: () => import('./user-catalog/user-catalog.module').then(m => m.UserCatalogModule)
  },
  {
    path:'auth',
    loadChildren:()=>import('./auth/auth.module').then(m=>m.AuthModule)
  },
  {
    path:'dashboard',
    loadChildren:()=>import('./protected/protected.module').then(m=>m.ProtectedModule),
    canActivate:[validarTokenGuard],
    canMatch: [validarTokenGuard2]
  },
  {
    path:'**',
    redirectTo:'auth'
  }
  
];
