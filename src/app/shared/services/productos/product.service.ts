// product.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from '../../../models/product';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrl = 'http://localhost:4000/store/';

  constructor(private http: HttpClient) {}

  // Métodos existentes...
  getAllProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}`);
  }

  getProducts(
    filters?: any,
    page: number = 1,
    limit: number = 10
  ): Observable<{
    total: number,
    page: number,
    pages: number,
    limit: number,
    products: Product[]
  }> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString());

    if (filters) {
      Object.keys(filters).forEach(key => {
        if (filters[key]) params = params.append(key, filters[key]);
      });
    }

    return this.http.get<{
      total: number,
      page: number,
      pages: number,
      limit: number,
      products: Product[]
    }>(this.apiUrl, { params });
  }

  getProductById(id: string): Observable<Product> {
    console.log(id)
    return this.http.get<Product>(`${this.apiUrl}${id}`);
  }

  getProductByProductId(productId: string): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}product-by-id/${productId}`);
  }

  // Método para agregar producto con imagen (usando FormData)
  addProductWithImage(formData: FormData): Observable<Product> {
    return this.http.post<Product>(`${this.apiUrl}agregar`, formData);
  }

 // product.service.ts - Añadimos método mejorado para actualización
  updateProduct(id: string, productData: Product | FormData): Observable<Product> {
    console.log(id, productData )
  if (productData instanceof FormData) {
    // Si es FormData, lo enviamos directamente
    return this.http.put<Product>(`${this.apiUrl}${id}`, productData);
  } else {
    // Si es objeto normal, lo enviamos como JSON
    return this.http.put<Product>(`${this.apiUrl}${id}`, productData, {
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

  // Método para subir imagen independiente
  subirImagen(formData: FormData): Observable<{imagePath: string}> {
    return this.http.post<{imagePath: string}>(`${this.apiUrl}images/single`, formData);
  }


  deleteProduct(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}${id}`);
  }

  getProductsWithoutStock(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}without-stock`);
  }
}
