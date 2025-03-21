import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Stock, Movimiento } from '../../../models/stock';

@Injectable({
  providedIn: 'root'
})
export class StockService {
  private apiUrl = 'http://localhost:4000/stock/';

  constructor(private http: HttpClient) {}

  // Obtener todo el stock
  getAllStock(): Observable<Stock[]> {
    return this.http.get<Stock[]>(this.apiUrl);
  }

  // Obtener el stock de un producto específico
  getStockByProductId(productId: string): Observable<Stock> {
    return this.http.get<Stock>(`${this.apiUrl}/products/${productId}`);
  }

  // Actualizar la cantidad de stock
  actualizarStock(productId: string, cantidad: number): Observable<Stock> {
    return this.http.put<Stock>(`${this.apiUrl}/products/${productId}`, { cantidad });
  }

  // Agregar un movimiento de stock
  agregarMovimiento(productId: string, movimiento: Movimiento): Observable<Stock> {
    return this.http.post<Stock>(`${this.apiUrl}/products/${productId}/movimientos`, movimiento);
  }

  // Eliminar un producto del stock
  eliminarStock(productId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}${productId}`);
  }
}
