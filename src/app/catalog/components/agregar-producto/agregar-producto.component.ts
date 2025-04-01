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
  imagePreview: string | ArrayBuffer | null = null;
  productsCount: number = 7; // Campos del formulario
  uploadProgress: number | null = null;

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private router: Router
  ) {
    this.productForm = this.fb.group({
      productId: ['', [
        Validators.required,
        Validators.pattern(/^[A-Za-z0-9]{5,20}$/)
      ]],
      nombre: ['', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(100)
      ]],
      precioDeCompra: ['', [
        Validators.required,
        Validators.min(10000),
      ]],
      accesorio: ['', Validators.required],
      material: ['', Validators.required],
      categoria: ['', Validators.required],
      descripcion: ['', [
        Validators.required,
        Validators.minLength(10),
        Validators.maxLength(500)
      ]]
    });
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file && file.type.startsWith('image/') && file.size <= 5 * 1024 * 1024) {
      this.selectedFile = file;

      // Generar vista previa
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result;
      };
      reader.readAsDataURL(file);
    } else {
      this.showErrorAlert('Formato de imagen no válido (Max. 5MB)');
      this.selectedFile = null;
      this.imagePreview = null;
    }
  }

  onSubmit(): void {
    if (this.productForm.valid && this.selectedFile) {
      const formData = new FormData();
      formData.append('image', this.selectedFile);

      Object.keys(this.productForm.controls).forEach(key => {
        formData.append(key, this.productForm.get(key)?.value);
      });

      this.uploadProgress = 0;

      this.productService.addProductWithImage(formData).subscribe({
        next: () => {
          this.showSuccessAlert('Producto agregado con éxito');
          this.productForm.reset();
          this.selectedFile = null;
          this.imagePreview = null;
          this.uploadProgress = null;
        },
        error: (error) => {
          console.error('Error:', error);
          this.showErrorAlert('Error al guardar el producto');
          this.uploadProgress = null;
        }
      });
    } else {
      this.showWarningAlert('Complete todos los campos y suba una imagen');
    }
  }

  private showSuccessAlert(message: string): void {
    Swal.fire({
      title: '¡Éxito!',
      text: message,
      icon: 'success',
      confirmButtonColor: '#f8d653',
      background: '#123456',
      color: '#e0e0e0',
      timer: 2000
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

  private showWarningAlert(message: string): void {
    Swal.fire({
      title: 'Advertencia',
      text: message,
      icon: 'warning',
      confirmButtonColor: '#f8d653',
      background: '#123456',
      color: '#e0e0e0'
    });
  }
}
