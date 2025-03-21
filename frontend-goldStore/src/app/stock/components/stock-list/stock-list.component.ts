import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { StockService } from '../../../shared/services/productos/stock.service';
import { Stock } from '../../../models/stock';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-stock-list',
  standalone:false,
  templateUrl: './stock-list.component.html',
  styleUrls: ['./stock-list.component.css']
})
export class StockListComponent implements OnInit {
  displayedColumns: string[] = ['productId', 'nombre', 'cantidad', 'acciones'];
  dataSource = new MatTableDataSource<Stock>();

  constructor(private stockService: StockService) {}

  ngOnInit(): void {
    this.getStockList();
  }

  getStockList(): void {
    this.stockService.getAllStock().subscribe({
      next: (data) => this.dataSource.data = data,
      error: (error) => console.error('Error al cargar el stock:', error)
    });
  }

  editarStock(stock: Stock): void {
    Swal.fire({
      title: 'Editar Stock',
      input: 'number',
      inputValue: stock.cantidad,
      showCancelButton: true,
      confirmButtonText: 'Actualizar',
      cancelButtonText: 'Cancelar',
      inputValidator: (value) => {
        if (!value || isNaN(Number(value)) || Number(value) < 0) {
          return 'Por favor, ingresa una cantidad válida';
        }
        return null;
      }
    }).then((result) => {
      if (result.isConfirmed) {
        this.stockService.actualizarStock(stock.productId, Number(result.value)).subscribe(() => {
          this.getStockList();
          Swal.fire('Actualizado', 'La cantidad de stock fue actualizada.', 'success');
        });
      }
    });
  }

  eliminarStock(productId: string): void {
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'Esta acción no se puede deshacer.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.stockService.eliminarStock(productId).subscribe(() => {
          this.getStockList();
          Swal.fire('Eliminado', 'El producto fue eliminado del stock.', 'success');
        });
      }
    });
  }
}
