import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ProductService } from '../../../shared/services/productos/product.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-agregar-producto',
  standalone: false,
  templateUrl: './agregar-producto.component.html',
  styleUrls: ['./agregar-producto.component.css']
})
export class AgregarProductoComponent {
  productForm: FormGroup;
  selectedFile: File | null = null;

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private router: Router
  ) {
    this.productForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
      precioDeCompra: ['', [Validators.required, Validators.min(0), Validators.max(1000000)]],
      accesorio: ['', Validators.required],
      material: ['', Validators.required],
      categoria: ['', Validators.required],
      descripcion: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(500)]],
      productId: ['', [Validators.required, Validators.pattern(/^[A-Za-z0-9]{5,20}$/)]]
    });
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file && file.type.startsWith('image/') && file.size <= 5 * 1024 * 1024) { // 5 MB
      this.selectedFile = file;
    } else {
      Swal.fire({
        title: 'Error',
        text: 'Por favor, selecciona una imagen válida (menos de 5 MB).',
        icon: 'error',
        confirmButtonText: 'Aceptar',
        confirmButtonColor: '#f8d653',
        background: '#123456',
        color: '#e0e0e0',
      });
      this.selectedFile = null;
    }
  }

  onSubmit() {
    if (this.productForm.valid && this.selectedFile) {
      const formData = new FormData();
      formData.append('image', this.selectedFile);

      // Agregar los demás campos del formulario
      Object.keys(this.productForm.controls).forEach((key) => {
        formData.append(key, this.productForm.get(key)?.value);
      });

      // Llamar al servicio para agregar el producto con la imagen
      this.productService.addProductWithImage(formData).subscribe({
        next: (response) => {
          console.log('Producto agregado:', response);

          // Mostrar alerta de éxito
          Swal.fire({
            title: '¡Éxito!',
            text: 'El producto se ha agregado correctamente.',
            icon: 'success',
            confirmButtonText: 'Aceptar',
            confirmButtonColor: '#f8d653',
            background: '#123456',
            color: '#e0e0e0',
          });

          // Vaciar los campos del formulario
          this.productForm.reset();
          this.selectedFile = null; // Limpiar la imagen seleccionada
        },
        error: (error) => {
          console.error('Error al agregar el producto:', error);

          // Mostrar alerta de error
          Swal.fire({
            title: 'Error',
            text: 'Hubo un problema al agregar el producto. Por favor, inténtalo de nuevo.',
            icon: 'error',
            confirmButtonText: 'Aceptar',
            confirmButtonColor: '#f8d653',
            background: '#123456',
            color: '#e0e0e0',
          });
        }
      });
    } else {
      console.error('Formulario inválido o archivo no seleccionado');

      // Mostrar alerta si el formulario es inválido o no se seleccionó una imagen
      Swal.fire({
        title: 'Advertencia',
        text: 'Por favor, completa todos los campos y selecciona una imagen válida.',
        icon: 'warning',
        confirmButtonText: 'Aceptar',
        confirmButtonColor: '#f8d653',
        background: '#123456',
        color: '#e0e0e0',
      });
    }
  }
}
