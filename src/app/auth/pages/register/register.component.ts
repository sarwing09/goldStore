import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: false,
  templateUrl: './register.component.html',
  styles: ``
})
export class RegisterComponent {

  miFormulario!: FormGroup

  constructor(private fb: FormBuilder, private authService:AuthService, private router:Router) {
    this.miFormulario = this.fb.group({
      name: ['Gniwras', [Validators.required, Validators.minLength(3)]],
      email: ['test@test.com', [Validators.required, Validators.email]], // ✅ Ahora los validadores están en un array
      password: ['123456', [Validators.required, Validators.minLength(6)]],
    });

  }

  registrar(){
        const { name, email, password } = this.miFormulario.value;
    
        this.authService.registro(name, email, password)
          .subscribe(ok => {
            console.log(ok)
    
            if (ok === true) {
              this.router.navigateByUrl('/dashboard')
            } else {
              //TODO: mostrar mensaje de error
    
              Swal.fire('Erorr', ok, 'error')
    
            }
          });
  }

}
