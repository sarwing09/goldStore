import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError, forkJoin, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { Stock, Movimiento } from '../../../models/stock';
import { Product } from '../../../models/product';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class StockService {
  private apiUrl: string = `${environment.baseUrl}/stock/`;

  constructor(private http: HttpClient) {}

  getAllStock(): Observable<Stock[]> {
    return this.http.get<Stock[]>(this.apiUrl);
  }

  getStockByProductId(productId: string): Observable<Stock> {
    return this.http.get<Stock>(`${this.apiUrl}products/${productId}`);
  }

  getProductsWithoutStock(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}products-without-stock`);
  }

  validateProductForStock(productId: string): Observable<{exists: boolean, hasStock: boolean, nombre?: string}> {
    return forkJoin({
      product: this.http.get<Product>(`http://localhost:4000/store/product-by-id/${productId}`).pipe(
        catchError(() => of(null))
      ),
      stock: this.getStockByProductId(productId).pipe(
        catchError(() => of(null))
      )
    }).pipe(
      map(({product, stock}) => ({
        exists: !!product,
        hasStock: !!stock,
        nombre: product?.nombre
      }))
    );
  }

  actualizarStock(productId: string, cantidad: number, nombre: string): Observable<Stock> {
    return this.http.put<Stock>(`${this.apiUrl}products/${productId}`, { cantidad, nombre });
  }

  agregarMovimiento(productId: string, movimiento: Movimiento, nombre: string): Observable<Stock> {
    return this.http.post<Stock>(`${this.apiUrl}products/${productId}/movimientos`, movimiento);
  }

  eliminarStock(productId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}${productId}`);
  }

  crearStockInicial(productId: string, nombre: string, cantidad: number): Observable<Stock> {
    return this.http.post<Stock>(`${this.apiUrl}crear-stock`, { productId, nombre, cantidad });
  }
}
