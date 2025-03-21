export interface Stock {
  _id?: string; // El ID es opcional porque MongoDB lo genera automáticamente
  productId: string; // Código del producto (relación con la tabla de productos)
  cantidad: number; // Cantidad en stock
  movimientos: Movimiento[]; // Historial de movimientos
}

export interface Movimiento {
  tipo: 'entrada' | 'salida'; // Tipo de movimiento
  cantidad: number; // Cantidad del movimiento
  fecha: Date; // Fecha del movimiento
}
