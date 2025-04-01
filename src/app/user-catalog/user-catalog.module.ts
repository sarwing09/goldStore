// src/app/user-catalog/user-catalog.module.ts
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'; // <-- Añade esta importación
import { UserCatalogRoutingModule } from './user-catalog-routing.module';
import { ProductListComponent } from './components/product-list/product-list.component';
import { MaterialModule } from '../material/material.module';

@NgModule({
  declarations: [
    ProductListComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule, // <-- Añade esta línea
    UserCatalogRoutingModule,
    MaterialModule
  ]
})
export class UserCatalogModule { }
