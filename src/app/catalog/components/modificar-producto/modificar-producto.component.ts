// src/app/catalog/components/modificar-producto/modificar-producto.component.ts
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import Swal from 'sweetalert2';
import { Product } from '../../../models/product';
import { ProductService } from '../../../shared/services/productos/product.service';
import { ActivatedRoute } from '@angular/router';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'app-modificar-producto',
  standalone:false,
  templateUrl: './modificar-producto.component.html',
  styleUrls: ['./modificar-producto.component.css']
})
export class ModificarProductoComponent implements OnInit {
  searchForm: FormGroup;
  productForm: FormGroup;
  product: Product | null = null;
  isLoading = false;
  isEditing = false;
  isSubmitting = false;
  selectedFile: File | null = null;
  imagePreview: string | ArrayBuffer | null = null;
  uploadProgress: number | null = null;
  allProductIds: string[] = [];
  filteredProductIds: string[] = [];

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private snackBar: MatSnackBar,
    private route: ActivatedRoute
  ) {
    this.searchForm = this.fb.group({
      productId: ['', [Validators.required, Validators.pattern(/^[A-Za-z0-9]{5,20}$/)]]
    });

    this.productForm = this.fb.group({
      picture: ['', Validators.required],
      nombre: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
      productId: ['', [Validators.required, Validators.pattern(/^[A-Za-z0-9]{5,20}$/)]],
      precioDeCompra: ['', [Validators.required, Validators.min(0), Validators.max(1000000)]],
      accesorio: ['', Validators.required],
      material: ['', Validators.required],
      categoria: ['', Validators.required],
      descripcion: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(500)]]
    });

    // Cargar todos los productIds al iniciar
    this.loadAllProductIds();
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const productId = params['productId'];
      if (productId) {
        this.searchForm.patchValue({ productId });
        this.searchProduct(); // Esto buscará automáticamente el producto
      }
    });

    // Configurar autocompletado
    this.searchForm.get('productId')?.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged()
      )
      .subscribe(value => {
        this.filterProductIds(value);
      });
  }

  loadAllProductIds(): void {
    this.productService.getAllProducts().subscribe({
      next: (products: Product[]) => {
        this.allProductIds = products.map(p => p.productId);
        this.filteredProductIds = [...this.allProductIds];
      },
      error: (error) => {
        console.error('Error loading product IDs:', error);
      }
    });
  }

  filterProductIds(value: string): void {
    if (!value) {
      this.filteredProductIds = [...this.allProductIds];
      return;
    }
    const filterValue = value.toLowerCase();
    this.filteredProductIds = this.allProductIds.filter(
      id => id.toLowerCase().includes(filterValue)
    );
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file && file.type.startsWith('image/') && file.size <= 5 * 1024 * 1024) {
      this.selectedFile = file;

      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result;
        this.productForm.patchValue({ picture: reader.result });
      };
      reader.readAsDataURL(file);
    } else {
      this.showErrorAlert('Formato de imagen no válido (Max. 5MB)');
      this.selectedFile = null;
      this.imagePreview = null;
    }
  }

  searchProduct(): void {
    if (this.searchForm.invalid) return;

    this.isLoading = true;
    const productId = this.searchForm.get('productId')?.value;

    this.productService.getProductByProductId(productId).subscribe({
      next: (product) => {
        this.product = product;
        this.productForm.patchValue(product);
        this.imagePreview = product.picture;
        this.isLoading = false;
        this.isEditing = true;
      },
      error: () => {
        this.showErrorAlert('Producto no encontrado');
        this.isLoading = false;
        this.isEditing = false;
      }
    });
  }

  onSubmit(): void {
    if (this.productForm.invalid || !this.product || !this.product._id) {
      this.showWarningAlert('Complete todos los campos correctamente');
      return;
    }

    this.isSubmitting = true;
    const formData = new FormData();

    if (this.selectedFile) {
      formData.append('image', this.selectedFile);
    }

    Object.keys(this.productForm.controls).forEach(key => {
      formData.append(key, this.productForm.get(key)?.value);
    });

    this.uploadProgress = 0;

    this.productService.updateProduct(this.product._id, formData).subscribe({
      next: () => {
        this.showSuccessAlert('Producto actualizado con éxito');
        this.resetForm();
        this.uploadProgress = null;
        this.isSubmitting = false;
      },
      error: (err) => {
        this.showErrorAlert('Error al actualizar el producto');
        this.isSubmitting = false;
        this.uploadProgress = null;
        console.error(err);
      },
      complete: () => {
        this.isSubmitting = false;
      }
    });
  }

  resetForm(): void {
    this.searchForm.reset();
    this.productForm.reset();
    this.product = null;
    this.isEditing = false;
    this.selectedFile = null;
    this.imagePreview = null;
    this.isLoading = false;
    this.isSubmitting = false;
  }

  private showSuccessAlert(message: string): void {
    Swal.fire({
      title: '¡Éxito!',
      text: message,
      icon: 'success',
      confirmButtonColor: '#f8d653',
      background: '#2d3748',
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
      background: '#2d3748',
      color: '#e0e0e0'
    });
  }

  private showWarningAlert(message: string): void {
    Swal.fire({
      title: 'Advertencia',
      text: message,
      icon: 'warning',
      confirmButtonColor: '#f8d653',
      background: '#2d3748',
      color: '#e0e0e0'
    });
  }
}