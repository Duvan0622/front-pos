import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

export interface Product {
  producto_id: number;
  cantidad: number;
}

export interface SaleRequest {
  cliente_id: number;
  productos: Product[];
}

export interface SaleResponse {
  numero_factura: string;
  cliente_nombre: string;
  fecha: string;
  total: string; // Formateado como "${:,.2f}"
}

@Injectable({
  providedIn: 'root'
})
export class StartSaleService {
  //private START_SALE_URL = 'https://back-fromages.azurewebsites.net/venta/iniciar-venta/';
  private START_SALE_URL = 'http://127.0.0.1:8000/venta/iniciar-venta/'; // URL del endpoint

  constructor(private http: HttpClient) {}

  private getAuthToken(): string | null {
    if (typeof window !== 'undefined' && localStorage) {
      return localStorage.getItem('authToken');
    }
    return null;
  }

  startSale(requestData: SaleRequest): Observable<SaleResponse> {
    const token = this.getAuthToken();
    if (!token) {
      console.error('Token de autenticación no encontrado. Verifica que el usuario haya iniciado sesión.');
      return throwError(() => new Error('Token de autenticación no encontrado.'));
    }

    const headers = new HttpHeaders({ 
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    return this.http.post<SaleResponse>(this.START_SALE_URL, requestData, { headers })
      .pipe(
        catchError(err => {
          console.error('Error al iniciar la venta:', err);
          return throwError(() => new Error('Error al procesar la solicitud de venta.'));
        })
      );
  }
}

