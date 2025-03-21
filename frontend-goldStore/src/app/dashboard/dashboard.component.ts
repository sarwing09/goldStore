import { Component, HostListener, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
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
