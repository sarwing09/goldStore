// stock.module.ts
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { StockRoutingModule } from './stock-routing.module';
import { StockListComponent } from './components/stock-list/stock-list.component';
import { MovimientoFormComponent } from './components/movimiento-form/movimiento-form.component';
import { StockDetailComponent } from './components/stock-detail/stock-detail.component';
import { MaterialModule } from '../material/material.module';

@NgModule({
  declarations: [
    StockListComponent,
    MovimientoFormComponent,
    StockDetailComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    StockRoutingModule,
    MaterialModule
  ]
})
export class StockModule {}
