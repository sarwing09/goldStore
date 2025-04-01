// src/app/stock/components/agregar-stock/agregar-stock.component.ts
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { StockService } from '../../../shared/services/productos/stock.service';
import { Product } from '../../../models/product';
import Swal from 'sweetalert2';
import { Observable } from 'rxjs';
import { map, startWith, take } from 'rxjs/operators';

@Component({
  selector: 'app-agregar-stock',
  standalone: false,
  templateUrl: './agregar-stock.component.html',
  styleUrls: ['./agregar-stock.component.css']
})
export class AgregarStockComponent implements OnInit {
  stockForm: FormGroup;
  productsWithoutStock: Product[] = [];
  filteredOptions!: Observable<Product[]>;
  selectedProduct: Product | null = null;
  isLoading = false;
  productsCount = 2;

  constructor(
    private fb: FormBuilder,
    private stockService: StockService,
    private router: Router
  ) {
    this.stockForm = this.fb.group({
      productId: ['', [Validators.required]],
      cantidad: ['', [Validators.required, Validators.min(1)]]
    });
  }

  ngOnInit(): void {
    this.loadProductsWithoutStock();
    this.setupAutocomplete();
  }

  private setupAutocomplete(): void {
    this.filteredOptions = this.stockForm.get('productId')!.valueChanges.pipe(
      startWith(''),
      map(value => {
        if (typeof value === 'string') {
          return this._filter(value);
        }
        return this.productsWithoutStock;
      })
    );
  }

  private _filter(value: string): Product[] {
    const filterValue = value.toLowerCase();
    return this.productsWithoutStock.filter(option =>
      option.productId.toLowerCase().includes(filterValue) ||
      option.nombre.toLowerCase().includes(filterValue)
    );
  }

  displayFn(product: Product | null): string {
    return product && product.productId ? `${product.productId} - ${product.nombre}` : '';
  }

  loadProductsWithoutStock(): void {
    this.isLoading = true;
    this.stockService.getProductsWithoutStock().pipe(take(1)).subscribe({
      next: (products) => {
        this.productsWithoutStock = products;
        this.isLoading = false;
        this.setupAutocomplete();
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }

  onProductSelected(event: { option: { value: Product } }): void {
    this.selectedProduct = event.option.value;
    this.stockForm.get('productId')?.setValue(this.selectedProduct.productId);
  }

  onSubmit(): void {
    if (this.stockForm.invalid || !this.selectedProduct) {
      this.showWarningAlert('Complete todos los campos correctamente');
      return;
    }

    const { cantidad } = this.stockForm.value;

    if (!this.selectedProduct) return;

    this.stockService.crearStockInicial(
      this.selectedProduct.productId,
      this.selectedProduct.nombre,
      cantidad
    ).subscribe({
      next: () => {
        this.showSuccessAlert('Stock inicial agregado correctamente');
        this.router.navigate(['/stock']);
      },
      error: (error) => {
        this.showErrorAlert('Error al agregar el stock: ' + error.message);
      }
    });
  }

  private showSuccessAlert(message: string): void {
    Swal.fire({
      title: '¡Éxito!',
      text: message,
      icon: 'success',
      confirmButtonColor: '#f8d653',
      background: '#123456',
      color: '#e0e0e0',
      timer: 2000
    });
  }

  private showErrorAlert(message: string): void {
    Swal.fire({
      title: 'Error',
      text: message,
      icon: 'error',
      confirmButtonColor: '#f8d653',
      background: '#123456',
      color: '#e0e0e0'
    });
  }

  private showWarningAlert(message: string): void {
    Swal.fire({
      title: 'Advertencia',
      text: message,
      icon: 'warning',
      confirmButtonColor: '#f8d653',
      background: '#123456',
      color: '#e0e0e0'
    });
  }
}
