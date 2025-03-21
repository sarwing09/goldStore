// movimiento-form.component.ts
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { StockService } from '../../../shared/services/productos/stock.service';
import { Movimiento } from '../../../models/stock';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-movimiento-form',
  standalone:false,
  templateUrl: './movimiento-form.component.html',
  styleUrls: ['./movimiento-form.component.css']
})
export class MovimientoFormComponent implements OnInit {
  movimientoForm!: FormGroup;
  productId!: string;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private stockService: StockService
  ) {}

  ngOnInit(): void {
    this.productId = this.route.snapshot.paramMap.get('productId') || '';
    this.movimientoForm = this.fb.group({
      tipo: ['entrada', Validators.required],
      cantidad: ['', [Validators.required, Validators.min(1)]],
      fecha: [new Date(), Validators.required]
    });
  }

  onSubmit(): void {
    if (this.movimientoForm.valid) {
      const movimiento: Movimiento = this.movimientoForm.value;
      this.stockService.agregarMovimiento(this.productId, movimiento).subscribe({
        next: () => {
          Swal.fire('Éxito', 'Movimiento registrado correctamente', 'success');
          this.router.navigate(['/stock']);
        },
        error: (error) => {
          console.error('Error al registrar movimiento:', error);
          Swal.fire('Error', 'No se pudo registrar el movimiento', 'error');
        }
      });
    }
  }
}

