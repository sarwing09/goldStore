// stock.module.ts
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { StockRoutingModule } from './stock-routing.module';
import { StockListComponent } from './components/stock-list/stock-list.component';
import { MaterialModule } from '../material/material.module';
import { AgregarStockComponent } from './components/agregar-stock/agregar-stock.component';
import { AgregarMovimientoComponent } from './components/agregar-movimiento/agregar-movimiento.component';
import { BuscarMovimientosComponent } from './components/buscar-movimientos/buscar-movimientos.component';

@NgModule({
  declarations: [
    StockListComponent,
    AgregarStockComponent,
    AgregarMovimientoComponent,
    BuscarMovimientosComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    StockRoutingModule,
    MaterialModule
  ]
})
export class StockModule {}
