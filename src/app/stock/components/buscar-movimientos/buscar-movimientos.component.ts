import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { StockService } from '../../../shared/services/productos/stock.service';
import { debounceTime, distinctUntilChanged, switchMap, startWith, map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-buscar-movimientos',
  standalone:false,
  templateUrl: './buscar-movimientos.component.html',
  styleUrls: ['./buscar-movimientos.component.css']
})
export class BuscarMovimientosComponent implements OnInit {
  searchForm: FormGroup;
  movimientos: any[] = [];
  displayedColumns: string[] = ['tipo', 'cantidad', 'fecha'];
  currentProduct: any = null;
  isLoading = false;
  filteredOptions!: Observable<any[]>;

  constructor(
    private stockService: StockService,
    private fb: FormBuilder
  ) {
    this.searchForm = this.fb.group({
      productId: new FormControl('')
    });
  }

  ngOnInit(): void {
    // Configurar el autocomplete
    this.filteredOptions = this.productIdControl.valueChanges.pipe(
      startWith(''),
      debounceTime(300),
      distinctUntilChanged(),
      switchMap(value => this._filter(value || ''))
    );

    // Cargar todos los productos al inicio para el autocomplete
    this.loadAllProducts();
  }

  private _filter(value: string): Observable<any[]> {
    const filterValue = value.toLowerCase();
    return this.stockService.getAllStock().pipe(
      map(stocks => stocks.filter(stock => 
        stock.productId.toLowerCase().includes(filterValue) || 
        stock.nombre.toLowerCase().includes(filterValue)
      )))
  }

  loadAllProducts(): void {
    this.stockService.getAllStock().subscribe();
  }

  searchMovements(): void {
    const productId = this.productIdControl.value;
    if (!productId) return;

    this.isLoading = true;
    this.stockService.getStockByProductId(productId).subscribe({
      next: (data) => {
        this.currentProduct = {
          productId: data.productId,
          nombre: data.nombre,
          cantidad: data.cantidad
        };
        this.movimientos = data.movimientos || [];
        this.isLoading = false;
      },
      error: () => {
        this.currentProduct = null;
        this.movimientos = [];
        this.isLoading = false;
      }
    });
  }

  get productIdControl(): FormControl {
    return this.searchForm.get('productId') as FormControl;
  }
}