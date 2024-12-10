
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class InvoiceReportService {
  //private API_URL = 'https://back-fromages.azurewebsites.net/reporte/facturas/';
  //private sucursalesURL = 'https://back-fromages.azurewebsites.net/reporte/sucursales/';

  private API_URL = 'http://127.0.0.1:8000/reporte/facturas/'; 
  private sucursalesURL = 'http://127.0.0.1:8000/reporte/sucursales/'; 

  private vendedor = 'http://127.0.0.1:8000/reporte/factura-list/'; 
  constructor(private http: HttpClient) {}

  private getAuthToken(): string | null {
    if (typeof window !== 'undefined' && localStorage) {
        return localStorage.getItem('authToken');
    }
    return null;
}

getData(startDate: string, endDate: string, sucursal: string): Observable<any> {
  const token = this.getAuthToken();
  if (!token) {
      console.error("Token de autenticación no encontrado. Verifica que el usuario haya iniciado sesión.");
      return throwError(() => new Error("Token de autenticación no encontrado."));
  }
  const params = { fecha_inicio: startDate, fecha_fin: endDate, sucursal }; // Eliminar 'option'
  const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });
  return this.http.get<any>(this.API_URL, { params, headers });
}


private getVendedorIdFromToken(token: string): string | null {
  try {
    const decodedToken = JSON.parse(atob(token.split('.')[1]));
    return decodedToken.user_id || null; 
  } catch (error) {
    console.error('Error al decodificar el token:', error);
    return null;
  }
}

getDataVendedor(option: string, startDate: string, endDate: string): Observable<any> {
  const token = this.getAuthToken();
  if (!token) {
    console.error("Token de autenticación no encontrado. Verifica que el usuario haya iniciado sesión.");
    return throwError(() => new Error("Token de autenticación no encontrado."));
  }

  const vendedorId = this.getVendedorIdFromToken(token);
  if (!vendedorId) {
    console.error("No se pudo obtener el vendedorId desde el token.");
    return throwError(() => new Error("No se pudo obtener el vendedorId."));
  }

  const params = { 
    option, 
    fecha_inicio: startDate, 
    fecha_fin: endDate, 
    vendedorId 
  };

  const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });

  return this.http.get<any>(this.vendedor, { params, headers });
}


  getSucursales(): Observable<any[]> {
    const token = this.getAuthToken();
    if (!token) {
      console.error("Token de autenticación no encontrado. Verifica que el usuario haya iniciado sesión.");
      return throwError(() => new Error("Token de autenticación no encontrado."));
    }
  
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });
  
    return this.http.get<any[]>(this.sucursalesURL, { headers });
  }

  getInvoiceDetail(numeroFactura: number): Observable<any> {
    const token = this.getAuthToken();
    if (!token) {
      console.error("Token de autenticación no encontrado. Verifica que el usuario haya iniciado sesión.");
      return throwError(() => new Error("Token de autenticación no encontrado."));
    }
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });
    //return this.http.get<any>(`https://back-fromages.azurewebsites.net/reporte/factura-detalle/${numeroFactura}/`, { headers });
    return this.http.get<any>(`http://127.0.0.1:8000//reporte/factura-detalle/${numeroFactura}/`, { headers });
 
  }

  
}