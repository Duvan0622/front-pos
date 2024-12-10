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
export class AddStockService {

  //private EPaF_URL = 'https://back-fromages.azurewebsites.net/venta/EPaF/';
  private EPaF_URL = 'http://127.0.0.1:8000/venta/EPaF/';  // URL de EPaF

  constructor(private http: HttpClient) {}

  private getAuthToken(): string | null {
    if (typeof window !== 'undefined' && localStorage) {
      return localStorage.getItem('authToken');
    }
    return null;
  }

  addStock(id_producto: number, cantidad: number): Observable<Product> {
    const token = this.getAuthToken();
    if (!token) {
      console.error('Token de autenticación no encontrado. Verifica que el usuario haya iniciado sesión.');
      return throwError(() => new Error('Token de autenticación no encontrado.'));
    }

    const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });
    const body = { cantidad };  // Solo se pasa la cantidad a agregar

    return this.http.put<Product>(`${this.EPaF_URL}${id_producto}/`, body, { headers });
  }
}
