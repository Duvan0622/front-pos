import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';

// Definir la interfaz del cliente
export interface Client {
  id: number;  
  documento: string;
  nombre: string;
  email: string;
  celular: string;
}

@Injectable({
  providedIn: 'root',
})
export class SearchClientService {

  //private CLIENT_URL = 'https://back-fromages.azurewebsites.net/venta/clientes/';
  private CLIENT_URL = 'http://127.0.0.1:8000/venta/clientes/'; 

  constructor(private http: HttpClient) {}

  private getAuthToken(): string | null {
    if (typeof window !== 'undefined' && localStorage) {
      return localStorage.getItem('authToken');
    }
    return null;
  }

  // Método para buscar un cliente por documento
  searchClient(documento: string): Observable<Client> {
    const token = this.getAuthToken();
    if (!token) {
      console.error('Token de autenticación no encontrado. Verifica que el usuario haya iniciado sesión.');
      return throwError(() => new Error('Token de autenticación no encontrado.'));
    }

    const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });
    return this.http.get<Client>(`${this.CLIENT_URL}${documento}/`, { headers });
  }
}
