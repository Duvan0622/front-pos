import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from '../../core/services/auth.service';
import { MatToolbarModule } from '@angular/material/toolbar';
@Component({
  selector: 'app-nav-bar',
  standalone: true,
  imports: [MatToolbarModule, CommonModule, MatIconModule, MatMenuModule, MatButtonModule],
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css'],
})
export class NavBarComponent {
  userName: string | null = null;
  userRole: string | null = null;

  constructor(private router: Router, private authService: AuthService) {}

  ngOnInit(): void {
    if (typeof window !== 'undefined' && localStorage) {
      this.userName = this.authService.getUserName(); 
      this.userRole = this.authService.getUserRole();
    }
  }

  showNavbar(): boolean {
    return this.router.url !== '/login';
  }

  canShowHome(): boolean {
    return true; 
  }

  canShowSale(): boolean {
    return this.userRole === 'vendedor';
  }

  canShowReport(): boolean {
    return this.userRole === 'gerente';
  }

  navigateTo(page: string): void {
    if (page === 'home') {
      this.router.navigate(['/home']);
    } else if (page === 'sale') {
      this.router.navigate(['/home/sale']);
    }
  }

  navigateToHome(): void {
    this.router.navigate(['/home']);
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
