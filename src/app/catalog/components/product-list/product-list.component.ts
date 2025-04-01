// src/app/user-catalog/components/product-list/product-list.component.ts
import { Component, OnInit, HostListener, Inject, PLATFORM_ID, ViewChild } from '@angular/core';
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

interface PaginationState {
  pageIndex: number;
  pageSize: number;
  length: number;
}

interface ProductResponse {
  products: Product[];
  total: number;
}

@Component({
  selector: 'app-product-list',
  standalone:false,
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {
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
    private router: Router
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

  ngAfterViewInit() {
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
      next: ({products, total}: ProductResponse) => {
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

  editProduct(id: any): void {
    if (id) this.router.navigate(['/catalogo/edit-product', id]);
  }

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
