
import { Injectable } from '@angular/core';
import { CanActivateFn, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

export const roleGuard: CanActivateFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  const authService = inject(AuthService);

  const expectedRole = route.data['expectedRole'];
  const userRole = authService.getUserRole();

  if (authService.isAuthenticated() && userRole === expectedRole) {
    return true;
  } else {
 
    return false;
  }
};