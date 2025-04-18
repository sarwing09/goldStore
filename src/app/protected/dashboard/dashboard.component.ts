import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../auth/services/auth.service';

@Component({
  selector: 'app-dashboard',
  standalone: false,
  templateUrl: './dashboard.component.html',
  styles: `
  
  *{
  
  margin:15px;

  }

  `
})
export class DashboardComponent {

  get usuario(){
    return this.authService.usuario;
  }

  constructor(private router:Router, private authService:AuthService){}
  Logout(){

    this.router.navigateByUrl('/auth');
    this.authService.logOut();

  }

}
