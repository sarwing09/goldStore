import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProductListComponent } from './components/product-list/product-list.component';
import { AgregarProductoComponent } from './components/agregar-producto/agregar-producto.component';

const routes: Routes = [
  {
    path:'',
    children:[
      {
        path:'show-catalog',
        component:ProductListComponent
      },
      {
        path:'add-product',
        component:AgregarProductoComponent
      },
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
