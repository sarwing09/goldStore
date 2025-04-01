import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StockListComponent } from './components/stock-list/stock-list.component';
import { AgregarStockComponent } from './components/agregar-stock/agregar-stock.component';
import { AgregarMovimientoComponent } from './components/agregar-movimiento/agregar-movimiento.component';
import { BuscarMovimientosComponent } from './components/buscar-movimientos/buscar-movimientos.component';

const routes: Routes = [
  { path: '', component: StockListComponent },
  { path: 'agregar-stock', component: AgregarStockComponent },
  {
    path: 'agregar-movimiento',
    component: AgregarMovimientoComponent,
    data: { title: 'Registrar Movimiento' }
  },
  {
    path: 'buscar-movimientos',
    component: BuscarMovimientosComponent,
    data: { title: 'Historial de Movimientos' }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StockRoutingModule { }
