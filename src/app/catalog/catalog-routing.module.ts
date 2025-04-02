import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProductListComponent } from './components/product-list/product-list.component';
import { AgregarProductoComponent } from './components/agregar-producto/agregar-producto.component';
import { ModificarProductoComponent } from './components/modificar-producto/modificar-producto.component';
import { ProductsTableComponent } from './components/products-table/products-table.component';

const routes: Routes = [
  {
    path:'',
    children:[
      {
        path:'admin-catalog',
        component:ProductListComponent
      },
      {
        path:'add-product',
        component:AgregarProductoComponent
      },
      {
        path:'products-table',
        component:ProductsTableComponent
      },
      { path: 'modificar', component: ModificarProductoComponent },
      {
        path:'**',
        redirectTo:'add-product'
      }
    ]
  },


];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CatalogRoutingModule { }
