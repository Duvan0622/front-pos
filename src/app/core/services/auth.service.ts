import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  //private LOGIN_URL = 'https://back-fromages.azurewebsites.net/auth/login/';
  private LOGIN_URL = 'http://127.0.0.1:8000/auth/login/'; 
  private tokenKey = 'authToken';
  constructor(private httpClient: HttpClient, private router: Router) {}

  getUserRole(): string | null {
    return localStorage.getItem('userRole');
  }

  private decodeToken(token: string): any {
    try {
      const payloadBase64 = token.split('.')[1];
      const payloadDecoded = atob(payloadBase64);
      const payload = JSON.parse(payloadDecoded);
      console.log('Decoded token payload:', payload);
      return payload;
    } catch (error) {
      console.error('Error decodificando el token:', error);
      return null;
    }
  }

  login(nombre_usuario: string, password: string): Observable<any> {
    return this.httpClient
      .post<any>(this.LOGIN_URL, { nombre_usuario, password })
      .pipe(
        tap({
          next: (response) => {
            console.log('Respuesta completa del servidor:', response);
            if (response.access) {
              console.log('Token recibido:', response.access);
              this.setToken(response.access);
              localStorage.setItem('userName', nombre_usuario);
              const payload = this.decodeToken(response.access);
              console.log('Payload del token:', payload);
              const userRole = response.user?.rol || null;

              if (userRole) {
                localStorage.setItem('userRole', userRole.toLowerCase());
                console.log(
                  'Rol del usuario almacenado en localStorage:',
                  userRole.toLowerCase()
                );
              } else {
                console.warn('No se encontró el rol en la respuesta');
              }
            } else {
              console.warn('No se recibió un token en la respuesta');
            }
          },
          error: (error) => {
            console.error('Error en la autenticación', error);
          },
        })
      );
  }

  private setToken(token: string): void {
    console.log('Guardando token:', token);
    localStorage.setItem(this.tokenKey, token);
  }

  private getToken(): string | null {
    return typeof window !== 'undefined' && localStorage
      ? localStorage.getItem(this.tokenKey)
      : null;
  }

  isAuthenticated(): boolean {
    const token = this.getToken();
    if (!token) {
      return false;
    }

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const exp = payload.exp * 1000;
      return Date.now() < exp;
    } catch (error) {
      console.error('Error al verificar el token:', error);
      return false;
    }
  }

  getUserName(): string | null {
    if (typeof window !== 'undefined' && localStorage) {
      return localStorage.getItem('userName');
    }
    return null;
  }

  /*  
  getUserName(): string | null {
    const token = this.getToken();
    if (token) {
      try {
        const payloadBase64 = token.split('.')[1];
        const payloadDecoded = atob(payloadBase64);
        const payload = JSON.parse(payloadDecoded);
        return payload.nombre_usuario || null; 
      } catch (error) {
        console.error('Error decodificando el token:', error);
        return null;
      }
    }
    return null;
  }*/

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem('userRole');
    localStorage.removeItem('userName');
    this.router.navigate(['/login']);
  }
}
