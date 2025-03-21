// stock-detail.component.ts
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { StockService } from '../../../shared/services/productos/stock.service';
import { Movimiento } from '../../../models/stock';

@Component({
  selector: 'app-stock-detail',
  standalone:false,
  templateUrl: './stock-detail.component.html',
  styleUrls: ['./stock-detail.component.css']
})
export class StockDetailComponent implements OnInit {
  movimientos: Movimiento[] = [];
  productId!: string;

  constructor(private route: ActivatedRoute, private stockService: StockService) {}

  ngOnInit(): void {
    this.productId = this.route.snapshot.paramMap.get('productId') || '';
    this.getMovimientos();
  }

  getMovimientos(): void {
    this.stockService.getStockByProductId(this.productId).subscribe({
      next: (data) => this.movimientos = data.movimientos,
      error: (error) => console.error('Error al obtener movimientos:', error)
    });
  }
}
