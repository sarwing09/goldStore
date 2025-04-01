import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { StockService } from '../../../shared/services/productos/stock.service';
import { Stock } from '../../../models/stock';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-stock-list',
  standalone: false,
  templateUrl: './stock-list.component.html',
  styleUrls: ['./stock-list.component.css']
})
export class StockListComponent implements OnInit {
  displayedColumns: string[] = ['productId', 'nombre', 'cantidad', 'acciones'];
  dataSource = new MatTableDataSource<Stock>();
  isMobile = false;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private stockService: StockService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.checkScreenSize();
    this.loadStock();
  }

  @HostListener('window:resize', ['$event'])
  checkScreenSize() {
    this.isMobile = window.innerWidth <= 768;
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  loadStock(): void {
    this.stockService.getAllStock().subscribe({
      next: (data: Stock[]) => {
        this.dataSource.data = data;
        this.dataSource.paginator = this.paginator;
      },
      error: (error) => {
        console.error('Error al cargar el stock:', error);
        this.showErrorAlert('Error al cargar el inventario');
      }
    });
  }

  // Método modificado para navegar a agregar-movimiento con el productId
  navigateToAddMovement(productId: string): void {
    this.router.navigate(['/stock/agregar-movimiento'], {
      queryParams: { productId }
    });
  }

  verMovimientos(productId: string): void {
    this.router.navigate(['/stock/buscar-movimientos'], {
      queryParams: { productId }
    });
  }

  eliminarStock(productId: string): void {
    Swal.fire({
      title: '¿Confirmar eliminación?',
      text: '¡Esta acción no se puede deshacer!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#f8d653',
      cancelButtonColor: '#e0e0e0',
      confirmButtonText: 'Eliminar',
      cancelButtonText: 'Cancelar',
      background: '#123456',
      color: '#e0e0e0'
    }).then((result) => {
      if (result.isConfirmed) {
        this.stockService.eliminarStock(productId).subscribe({
          next: () => {
            this.loadStock();
            this.showSuccessAlert('Registro eliminado');
          },
          error: () => this.showErrorAlert('Error al eliminar')
        });
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
      color: '#e0e0e0'
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
}
