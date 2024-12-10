import { Component, OnInit } from '@angular/core';
import {MatIconModule} from '@angular/material/icon';
import { NavBarComponent } from '../nav-bar/nav-bar.component';
import { AuthService } from '../../core/services/auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [MatIconModule, NavBarComponent, CommonModule, RouterModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})

export class HomeComponent implements OnInit {
  userRole: string | null = null;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.userRole = this.authService.getUserRole()?.toLowerCase() || null;
  }

  items = [
    { label: 'Productos', active: false, route: '/home/product' },
    { label: 'Venta', active: false, route: '/home/sale' },
    { label: 'Reporte', active: false, route: '/home/report' },
    { label: 'Facturas', active: false, route: '/home/invoice' },
  ];

  canShowItem(label: string): boolean {
    if (this.userRole === 'gerente' && label === 'Reporte') {
      return true;
    } else if (this.userRole === 'vendedor' && label !== 'Reporte') {
      return true;
    }
    return false;
  }

  onBoxClick(selectedItem: any) {
    this.items.forEach((item) => (item.active = false));
    selectedItem.active = true;
    this.router.navigate([selectedItem.route]);
  }
}