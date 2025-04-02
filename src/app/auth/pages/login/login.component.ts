import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.component.html',
  styles: ``
})
export class LoginComponent {

  miFormulario!: FormGroup

  constructor(private router: Router, private fb: FormBuilder, private authService: AuthService) {
    this.miFormulario = this.fb.group({
      email: ['test@test.com', [Validators.required, Validators.email]], // ✅ Ahora los validadores están en un array
      password: ['123456', [Validators.required, Validators.minLength(6)]]
    });

  }

  login() {
    const { email, password } = this.miFormulario.value;

    this.authService.login(email, password)
      .subscribe(ok => {
        console.log(ok)

        if (ok === true) {
          this.router.navigateByUrl('/catalogo/admin-catalog')
        } else {
          //TODO: mostrar mensaje de error

          Swal.fire('Erorr', ok, 'error')

        }
      });
  }


}
