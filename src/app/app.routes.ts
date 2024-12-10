import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { ProductComponent } from './components/product/product.component';
import { SaleComponent } from './components/sale/sale.component';
import { ReportComponent } from './components/report/report.component';
import { authGuard } from './core/guards/auth.guard';
import { authenticatedGuard } from './core/guards/authenticated.guard';
import { roleGuard } from './core/guards/role.guard';
import { InvoiceComponent } from './components/invoice/invoice.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full',
  },
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [authenticatedGuard],
  },
  {
    path: 'home',
    component: HomeComponent,
    canActivate: [authGuard],
  },
  {
    path: 'home/product',
    component: ProductComponent,
    canActivate: [authGuard, roleGuard],
    data: { expectedRole: 'vendedor' }, 
  },
  {
    path: 'home/report',
    component: ReportComponent,
    canActivate: [authGuard, roleGuard],
    data: { expectedRole: 'gerente' }, 
  },
  {
    path: 'home/sale',
    component: SaleComponent,
    canActivate: [authGuard, roleGuard],
    data: { expectedRole: 'vendedor' }, 
  },
  {
    path: 'home/invoice',
    component: InvoiceComponent,
    canActivate: [authGuard, roleGuard],
    data: { expectedRole: 'vendedor' }, 
  }
];
