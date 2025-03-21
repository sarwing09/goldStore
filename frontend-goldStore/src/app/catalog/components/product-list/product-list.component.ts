import { Component, OnInit, HostListener, Inject, PLATFORM_ID } from '@angular/core';
import { ProductService } from '../../../shared/services/productos/product.service';
import { Product } from '../../../models/product';
import { FormBuilder, FormGroup } from '@angular/forms';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-product-list',
  standalone:false,
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {
  products!: Product[];
  isExpanded = false;
  expandedImageUrl = '';
  searchForm: FormGroup;
  isSearchExpanded = false;
  isMobileOrTablet = false;

  constructor(
    private productService: ProductService,
    private fb: FormBuilder,
    @Inject(PLATFORM_ID) private platformId: Object // Inyectar PLATFORM_ID
  ) {
    this.searchForm = this.fb.group({
      categoria: [''],
      material: [''],
      minPrice: [''],
      maxPrice: ['']
    });
  }

  ngOnInit(): void {
    this.getProducts();
    if (isPlatformBrowser(this.platformId)) { // Verificar si está en el navegador
      this.checkScreenSize();
    }
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
    if (isPlatformBrowser(this.platformId)) { // Verificar si está en el navegador
      this.checkScreenSize();
    }
  }

  checkScreenSize(): void {
    if (isPlatformBrowser(this.platformId)) { // Verificar si está en el navegador
      this.isMobileOrTablet = window.innerWidth <= 1024;
      this.isSearchExpanded = !this.isMobileOrTablet;
    }
  }

  toggleSearchForm(): void {
    if (this.isMobileOrTablet) {
      this.isSearchExpanded = !this.isSearchExpanded;
    }
  }

  resetForm(): void {
    this.searchForm.reset();
    this.loadProducts();
  }

  loadProducts(filters?: any): void {
    this.productService.getProducts(filters).subscribe({
      next: (data: Product[]) => {
        this.products = data;
      },
      error: (error) => {
        console.error('Error al obtener los productos:', error);
      }
    });
  }

  onSearch(): void {
    const filters = this.searchForm.value;
    this.loadProducts(filters);

    if (this.isMobileOrTablet) {
      this.isSearchExpanded = false;
    }
  }

  getProducts() {
    this.productService.getProducts().subscribe({
      next: (data: Product[]) => {
        this.products = data;
      },
      error: (error) => {
        console.error('Error al obtener los productos:', error);
      }
    });
  }

  expandImage(imageUrl: string): void {
    this.expandedImageUrl = imageUrl;
    this.isExpanded = true;
  }

  closeImage(): void {
    this.isExpanded = false;
    this.expandedImageUrl = '';
  }
}
