// app.routes.ts
import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'catalogo',
    loadChildren: () => import('./catalog/catalog.module').then(m => m.CatalogModule)
  },
  {
    path: 'stock',
    loadChildren: () => import('./stock/stock.module').then(m => m.StockModule)
  },
  {
    path: '**',
    redirectTo: 'catalogo'
  }
];
