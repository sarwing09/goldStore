import { Component, OnInit, HostListener, Inject, PLATFORM_ID, ViewChild, AfterViewInit } from '@angular/core';
import { ProductService } from '../../../shared/services/productos/product.service';
import { StockService } from '../../../shared/services/productos/stock.service';
import { Product } from '../../../models/product';
import { FormBuilder, FormGroup } from '@angular/forms';
import { isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { BehaviorSubject, combineLatest } from 'rxjs';
import { switchMap, tap, map } from 'rxjs/operators';
import { Stock } from '../../../models/stock';
import { MatSnackBar } from '@angular/material/snack-bar';

/**
* * Información importante
* TODO: nada jejejjeje
* ! Método deprecated
* ? Preguntas
*/


interface PaginationState {
  pageIndex: number;
  pageSize: number;
  length: number;
}

interface ProductResponse {
  products: Product[];
  total: number;
}

interface CartItem {
  product: Product;
  quantity: number;
}

@Component({
  selector: 'app-product-list',
  standalone:false,
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit, AfterViewInit {
  dataSource = new MatTableDataSource<Product>([]);
  paginationState: PaginationState = {
    pageIndex: 0,
    pageSize: 10,
    length: 0
  };

  searchForm: FormGroup;
  isExpanded = false;
  expandedImageUrl = '';
  isSearchExpanded = true;
  isMobileOrTablet = false;
  isLoading = false;
  cartItems: CartItem[] = [];
  isCartOpen = false;

  private paginationSubject = new BehaviorSubject<{pageIndex: number, pageSize: number}>({
    pageIndex: 0,
    pageSize: 10
  });
  private filtersSubject = new BehaviorSubject<any>({});

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private productService: ProductService,
    private stockService: StockService,
    private fb: FormBuilder,
    @Inject(PLATFORM_ID) private platformId: Object,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.searchForm = this.fb.group({
      categoria: [''],
      material: [''],
      minPrice: [''],
      maxPrice: ['']
    });
  }

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.checkScreenSize();
    }
    this.setupDataStream();
    this.filtersSubject.next(this.searchForm.value);
  }

  ngAfterViewInit(): void {
    this.setupPaginator();
  }

  private setupDataStream(): void {
    combineLatest([
      this.paginationSubject,
      this.filtersSubject
    ]).pipe(
      tap(() => this.isLoading = true),
      switchMap(([pagination, filters]) => {
        return this.productService.getProducts(
          filters,
          pagination.pageIndex + 1,
          pagination.pageSize
        ).pipe(
          switchMap(response => {
            this.paginationState.length = response.total;
            return this.stockService.getAllStock().pipe(
              map((stockItems: Stock[]) => {
                return {
                  products: response.products.map(product => ({
                    ...product,
                    stock: stockItems.find(s => s.productId === product.productId)?.cantidad ?? 0
                  })),
                  total: response.total
                };
              })
            );
          })
        );
      })
    ).subscribe({
      next: ({products, total}: {products: Product[], total: number}) => {
        this.dataSource.data = products;
        this.paginationState.length = total;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading products:', error);
        this.isLoading = false;
      }
    });
  }

  private setupPaginator(): void {
    if (this.paginator) {
      this.paginator.page.subscribe((event: PageEvent) => {
        this.paginationSubject.next({
          pageIndex: event.pageIndex,
          pageSize: event.pageSize
        });
      });
    }
  }

  // Métodos del carrito
  addToCart(product: Product): void {
    const existingItem = this.cartItems.find(item => item.product._id === product._id);

    if (existingItem) {
      existingItem.quantity += 1;
      this.snackBar.open('Cantidad actualizada en el carrito', 'Cerrar', { duration: 2000 });
    } else {
      this.cartItems.push({ product, quantity: 1 });
      this.snackBar.open('Producto añadido al carrito', 'Cerrar', { duration: 2000 });
    }
  }

  removeFromCart(index: number): void {
    this.cartItems.splice(index, 1);
    this.snackBar.open('Producto eliminado del carrito', 'Cerrar', { duration: 2000 });
  }

  updateQuantity(item: CartItem, newQuantity: number): void {
    if (newQuantity > 0) {
      item.quantity = newQuantity;
    } else {
      this.removeFromCart(this.cartItems.indexOf(item));
    }
  }

  getCartTotal(): number {
    return this.cartItems.reduce((total, item) => total + (item.product.precioDeCompra * item.quantity), 0);
  }

  toggleCart(): void {
    this.isCartOpen = !this.isCartOpen;
  }

  sendWhatsAppMessage(): void {
    if (this.cartItems.length === 0) return;

    const phoneNumber = '573112013834';
    let message = '¡Hola! Estoy interesado en los siguientes productos:\n\n';

    this.cartItems.forEach((item, index) => {
      message += `*${index + 1}. ${item.product.nombre}*\n`;
      message += `- Código: ${item.product.productId}\n`;
      message += `- Cantidad: ${item.quantity}\n`;
      message += `- Precio unitario: $${item.product.precioDeCompra.toFixed(2)}\n`;
      message += `- Subtotal: $${(item.product.precioDeCompra * item.quantity).toFixed(2)}\n\n`;
    });

    message += `*Total: $${this.getCartTotal().toFixed(2)}*\n\n`;
    message += '¿Podrías darme más información y confirmar disponibilidad?';

    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');
  }

  // Métodos existentes
  onSearch(): void {
    this.paginationSubject.next({
      pageIndex: 0,
      pageSize: this.paginationState.pageSize
    });
    this.filtersSubject.next(this.searchForm.value);
  }

  resetForm(): void {
    this.searchForm.reset();
    this.onSearch();
  }

  expandImage(imageUrl: string): void {
    this.expandedImageUrl = imageUrl;
    this.isExpanded = true;
  }

  closeImage(): void {
    this.isExpanded = false;
    this.expandedImageUrl = '';
  }

  viewDetails(id: string|undefined): void {
    if (id) this.router.navigate(['/user-catalog', id]);
  }

  contactViaWhatsApp(product: Product): void {
    const phoneNumber = '573112013834';
    const encodedMessage = encodeURIComponent(
      `¡Hola! Estoy interesado en el producto:\n\n*${product.nombre}*\n\n` +
      `- Código: ${product.productId}\n` +
      `- Precio: ${product.precioDeCompra.toFixed(2)}\n\n` +
      `¿Podrías darme más información?`
    );
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');
  }

  @HostListener('window:resize')
  checkScreenSize(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.isMobileOrTablet = window.innerWidth <= 1024;
      this.isSearchExpanded = !this.isMobileOrTablet;
    }
  }

  toggleSearchForm(): void {
    if (this.isMobileOrTablet) {
      this.isSearchExpanded = !this.isSearchExpanded;
    }
  }
}
