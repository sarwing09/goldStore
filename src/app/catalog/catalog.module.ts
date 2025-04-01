import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CatalogRoutingModule } from './catalog-routing.module';
import { ProductListComponent } from './components/product-list/product-list.component';
import { ProductDetailComponent } from './components/product-detail/product-detail.component';
import { MaterialModule } from '../material/material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { AgregarProductoComponent } from './components/agregar-producto/agregar-producto.component';
import { ModificarProductoComponent } from './components/modificar-producto/modificar-producto.component';



@NgModule({
  declarations: [
   ProductListComponent,
   ProductDetailComponent,
   AgregarProductoComponent,
   ModificarProductoComponent
  ],
  imports: [
    CommonModule,
    CatalogRoutingModule,
    MaterialModule,
    ReactiveFormsModule
  ],
  exports:[
  ProductListComponent,
   ProductDetailComponent,
   CatalogRoutingModule
  ]
})
export class CatalogModule { }
