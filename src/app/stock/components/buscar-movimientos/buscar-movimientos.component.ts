import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { StockService } from '../../../shared/services/productos/stock.service';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';

@Component({
  selector: 'app-buscar-movimientos',
  standalone: false,
  templateUrl: './buscar-movimientos.component.html',
  styleUrls: ['./buscar-movimientos.component.css']
})
export class BuscarMovimientosComponent implements OnInit {
  searchForm: FormGroup;
  movimientos: any[] = [];
  displayedColumns: string[] = ['tipo', 'cantidad', 'fecha'];
  stockItems: any[] = [];
  filteredOptions: any[] = [];
  currentProduct: any = null;

  constructor(
    private route: ActivatedRoute,
    private stockService: StockService,
    private fb: FormBuilder
  ) {
    this.searchForm = this.fb.group({
      productId: new FormControl('') // Cambio clave aquí
    });
  }

  ngOnInit(): void {
    this.loadStockItems();

    this.route.queryParams.subscribe(params => {
      if (params['productId']) {
        this.loadProductDetails(params['productId']);
      }
    });
  }

  loadStockItems(): void {
    this.stockService.getAllStock().subscribe({
      next: (data) => {
        this.stockItems = data;
        this.filteredOptions = data;
      }
    });
  }

  loadProductDetails(productId: string): void {
    this.stockService.getStockByProductId(productId).subscribe({
      next: (data) => {
        this.currentProduct = {
          productId: data.productId,
          nombre: data.nombre,
          cantidad: data.cantidad
        };
        this.movimientos = data.movimientos || [];
      }
    });
  }

  onOptionSelected(event: MatAutocompleteSelectedEvent): void {
    const productId = event.option.value;
    this.loadProductDetails(productId);
  }

  // Añadimos un getter para el control del formulario
  get productIdControl(): FormControl {
    return this.searchForm.get('productId') as FormControl;
  }
}
