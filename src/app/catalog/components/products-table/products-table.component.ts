import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ProductService } from '../../../shared/services/productos/product.service';
import { Product } from '../../../models/product';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-products-table',
  standalone:false,
  templateUrl: './products-table.component.html',
  styleUrls: ['./products-table.component.css']
})
export class ProductsTableComponent implements OnInit {
  displayedColumns: string[] = [
    'productId', 
    'nombre', 
    'accesorio', 
    'material', 
    'precioDeCompra', 
    'actions'
  ];
  dataSource = new MatTableDataSource<Product>([]);
  isLoading = true;
  totalItems = 0;
  currentPage = 1;
  pageSize = 10;
  pageSizeOptions = [5, 10, 25, 100];
  filterValue = '';

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private productService: ProductService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }

  loadProducts(): void {
    this.isLoading = true;
    
    this.productService.getProductsPaginated(
      this.currentPage,
      this.pageSize,
      { search: this.filterValue }
    ).subscribe({
      next: (response) => {
        this.dataSource.data = response.products;
        this.totalItems = response.total;
        this.isLoading = false;
        
        if (this.paginator) {
          this.paginator.length = this.totalItems;
          this.paginator.pageIndex = this.currentPage - 1;
          this.paginator.pageSize = this.pageSize;
        }
      },
      error: (error) => {
        console.error('Error:', error);
        this.isLoading = false;
        this.showSnackbar('Error al cargar productos', 'error');
      }
    });
  }

  onPageChange(event: PageEvent): void {
    this.currentPage = event.pageIndex + 1;
    this.pageSize = event.pageSize;
    this.loadProducts();
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.filterValue = filterValue.trim().toLowerCase();
    this.currentPage = 1;
    this.loadProducts();
  }

  confirmDelete(product: Product): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '350px',
      data: {
        title: 'Confirmar eliminación',
        message: `¿Estás seguro de eliminar "${product.nombre}" (Código: ${product.productId})?`,
        confirmText: 'Eliminar',
        cancelText: 'Cancelar'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.deleteProduct(product.productId);
      }
    });
  }

  private deleteProduct(productId: string): void {
    this.productService.deleteProductByCode(productId).subscribe({
      next: (response) => {
        let message = response.message;
        if (response.deletedImage) {
          message += ' (Imagen eliminada de Cloudinary)';
        } else {
          message += ' (No se encontró imagen para eliminar)';
        }
        
        this.showSnackbar(message, response.success ? 'success' : 'error');
        this.loadProducts();
      },
      error: (error) => {
        const errorMessage = error.message || 'Error al eliminar el producto';
        this.showSnackbar(errorMessage, 'error');
        console.error('Error en deleteProduct:', error);
      }
    });
  }

  private showSnackbar(message: string, type: 'success' | 'error'): void {
    this.snackBar.open(message, 'Cerrar', {
      duration: 3000,
      panelClass: [`${type}-snackbar`]
    });
  }
}