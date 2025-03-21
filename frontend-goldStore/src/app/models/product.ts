export interface Product {
  _id?: string; // El ID es opcional porque MongoDB lo genera automáticamente
  picture: string;
  nombre: string;
  productId:string;
  precioDeCompra: number;
  accesorio: string;
  material: string;
  categoria: string;
  descripcion: string;
}
