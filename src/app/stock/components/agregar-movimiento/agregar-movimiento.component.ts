// src/app/stock/components/agregar-movimiento/agregar-movimiento.component.ts
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { StockService } from '../../../shared/services/productos/stock.service';
import { ProductService } from '../../../shared/services/productos/product.service';
import { Movimiento, Stock } from '../../../models/stock';
import { Product } from '../../../models/product';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-agregar-movimiento',
  standalone: false,
  templateUrl: './agregar-movimiento.component.html',
  styleUrls: ['./agregar-movimiento.component.css']
})
export class AgregarMovimientoComponent implements OnInit {
  movimientoForm: FormGroup;
  stockItems: Stock[] = [];
  filteredStock: Stock[] = [];
  selectedProduct: (Stock & Partial<Product>) | null = null;
  productIdFromRoute: string | null = null;
  isLoading: boolean = false;
  selectedMovementIcon: string = 'arrow_downward';

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private stockService: StockService,
    private productService: ProductService
  ) {
    this.movimientoForm = this.fb.group({
      productId: ['', [Validators.required]],
      tipo: ['entrada', [Validators.required]],
      cantidad: ['', [Validators.required, Validators.min(1)]]
    });
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.productIdFromRoute = params['productId'] || null;
      if (this.productIdFromRoute) {
        this.movimientoForm.patchValue({
          productId: this.productIdFromRoute
        });
        this.loadProductDetails(this.productIdFromRoute);
      }
    });

    this.movimientoForm.get('tipo')?.valueChanges.subscribe(value => {
      this.selectedMovementIcon = value === 'entrada' ? 'arrow_downward' : 'arrow_upward';
    });

    this.loadStock();

    this.movimientoForm.get('productId')?.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged()
      )
      .subscribe(value => {
        if (value && value.length >= 3) {
          this.checkProductId(value);
        } else {
          this.selectedProduct = null;
        }
      });
  }

  displayFn(product: Stock | null): string {
    return product?.productId ? `${product.productId} - ${product.nombre}` : '';
  }

  loadStock(): void {
    this.isLoading = true;
    this.stockService.getAllStock().subscribe({
      next: (data: Stock[]) => {
        this.stockItems = data;
        this.filteredStock = data;
        this.isLoading = false;

        if (this.productIdFromRoute) {
          const product = this.stockItems.find(item => item.productId === this.productIdFromRoute);
          if (product) {
            this.selectedProduct = product;
          }
        }
      },
      error: (error) => {
        console.error('Error al cargar el stock:', error);
        this.isLoading = false;
      }
    });
  }

  checkProductId(productId: string): void {
    const exactMatch = this.stockItems.find(item =>
      item.productId.toLowerCase() === productId.toLowerCase()
    );

    if (exactMatch) {
      this.selectedProduct = exactMatch;
      this.movimientoForm.patchValue({
        productId: exactMatch.productId
      });
    } else {
      this.selectedProduct = null;
    }
  }

  onProductSelected(event: { option: { value: string } }): void {
    const productId = event.option.value;
    this.loadProductDetails(productId);
  }

  loadProductDetails(productId: string): void {
    this.isLoading = true;
    forkJoin({
      stock: this.stockService.getStockByProductId(productId),
      product: this.productService.getProductByProductId(productId)
    }).subscribe({
      next: ({ stock, product }: { stock: Stock, product: Product }) => {
        this.selectedProduct = {
          ...stock,
          accesorio: product?.accesorio,
          material: product?.material,
          categoria: product?.categoria
        };
        this.isLoading = false;
      },
      error: () => {
        this.selectedProduct = null;
        this.isLoading = false;
      }
    });
  }

  onSubmit(): void {
    if (this.movimientoForm.invalid || !this.selectedProduct) {
      Swal.fire({
        title: 'Error',
        text: 'Por favor complete todos los campos correctamente',
        icon: 'error',
        confirmButtonColor: '#f8d653',
        background: '#123456',
        color: '#e0e0e0'
      });
      return;
    }

    const movimiento: Movimiento = {
      tipo: this.movimientoForm.value.tipo,
      cantidad: this.movimientoForm.value.cantidad,
      fecha: new Date()
    };

    this.stockService.agregarMovimiento(
      this.movimientoForm.value.productId,
      movimiento,
      this.selectedProduct.nombre
    ).subscribe({
      next: () => {
        Swal.fire({
          title: '¡Éxito!',
          text: 'Movimiento registrado correctamente',
          icon: 'success',
          confirmButtonColor: '#f8d653',
          background: '#123456',
          color: '#e0e0e0',
          timer: 2000
        });
        this.router.navigate(['/stock']);
      },
      error: (error) => {
        Swal.fire({
          title: 'Error',
          text: error.message || 'Error al registrar el movimiento',
          icon: 'error',
          confirmButtonColor: '#f8d653',
          background: '#123456',
          color: '#e0e0e0'
        });
      }
    });
  }
}
