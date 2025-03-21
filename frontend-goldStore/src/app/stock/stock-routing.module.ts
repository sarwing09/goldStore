// stock-routing.module.ts
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StockListComponent } from './components/stock-list/stock-list.component';
import { MovimientoFormComponent } from './components/movimiento-form/movimiento-form.component';
import { StockDetailComponent } from './components/stock-detail/stock-detail.component';

const routes: Routes = [
  { path: '', component: StockListComponent },
  { path: 'movimiento/:productId', component: MovimientoFormComponent },
  { path: 'detalle/:productId', component: StockDetailComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StockRoutingModule {}
