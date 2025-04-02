import { Component, HostListener, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterLink, CommonModule, MatIconModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
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
      if (!this.isMobile) {
        this.dashboardActive = false;
      }
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
      document.body.classList.toggle('dashboard-active', this.dashboardActive);
    }
  }
}