import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import { Observable, throwError} from 'rxjs';

export interface Product {
  id: number;
  nombre: string;
  precio: number;
  stock: number;
  precio_formateado: string;
}

@Injectable({
  providedIn: 'root'
})


export class SearchProductService {
  // private PRODUCT_URL = 'https://back-fromages.azurewebsites.net//venta/productos/'; // Asegúrate de que coincida con el endpoint en el backend
  private PRODUCT_URL = 'http://127.0.0.1:8000/venta/productos/';
  constructor(private http: HttpClient) {}

  private getAuthToken(): string | null {
    if (typeof window !== 'undefined' && localStorage) {
      return localStorage.getItem('authToken');
    }
    return null;
  }

  
  searchProducts(query?: string): Observable<any[]> {
    const token = this.getAuthToken();
    if (!token) {
      console.error('Token de autenticación no encontrado.');
      return throwError(() => new Error('Token de autenticación no encontrado.'));
    }
  
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });
    let params = new HttpParams();
    if (query) {
      params = params.set('query', query);
    }
    return this.http.get<any[]>(this.PRODUCT_URL, { params, headers });
  }
}