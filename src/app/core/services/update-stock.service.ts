import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';

export interface Product {
  id: number;
  nombre: string;
  precio: number;
  stock: number;
}

@Injectable({
  providedIn: 'root'
})
export class UpdateStockService {

  //private APaF_URL = 'https://back-fromages.azurewebsites.net/venta/APaF/';
  private APaF_URL = 'http://127.0.0.1:8000/venta/APaF/';  // URL de APaF

  constructor(private http: HttpClient) {}

  private getAuthToken(): string | null {
    if (typeof window !== 'undefined' && localStorage) {
      return localStorage.getItem('authToken');
    }
    return null;
  }

  updateStock(id_producto: number, cantidad: number): Observable<Product> {
    const token = this.getAuthToken();
    if (!token) {
      console.error('Token de autenticación no encontrado. Verifica que el usuario haya iniciado sesión.');
      return throwError(() => new Error('Token de autenticación no encontrado.'));
    }

    const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });
    const body = { cantidad };  // Solo se pasa la cantidad a restar

    return this.http.put<Product>(`${this.APaF_URL}${id_producto}/`, body, { headers });
  }
}

