export interface Product {
  _id?: string; // Cambiado a obligatorio
  picture: string;
  nombre: string;
  productId: string;
  precioDeCompra: number;
  accesorio: string;
  material: string;
  categoria: string;
  descripcion: string;
  stock: number; // Obligatorio
}
