import { Component, HostListener, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterOutlet} from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, DashboardComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'goldStore';
  isMobile = false;
  dashboardActive = false;

  constructor(@Inject(PLATFORM_ID) private platformId: object) {
    if (isPlatformBrowser(this.platformId)) {
      this.checkScreenWidth();
    }
  }

  @HostListener('window:resize', ['$event'])
  checkScreenWidth() {
    if (isPlatformBrowser(this.platformId)) {
      this.isMobile = window.innerWidth <= 1024;
    }
  }

  showDashboard() {
    if (!this.isMobile) {
      this.dashboardActive = true;
    }
  }

  hideDashboard() {
    if (!this.isMobile) {
      this.dashboardActive = false;
    }
  }

  toggleDashboard() {
    if (this.isMobile) {
      this.dashboardActive = !this.dashboardActive;
    }
  }
}
