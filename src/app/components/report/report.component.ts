import { Component, OnInit, ChangeDetectorRef, ViewChild, AfterViewInit } from '@angular/core';
import { InvoiceReportService } from '../../core/services/invoice-report.service';
import { MatTableDataSource } from '@angular/material/table';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { DetailDialogComponent } from '../../dialogs/detail-dialog/detail-dialog.component';
import { CdkTableModule } from '@angular/cdk/table';

import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';

@Component({
  selector: 'app-report',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatTableModule,
    MatPaginatorModule,
    MatSelectModule,
    MatDialogModule,
    CdkTableModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatPaginator,
  ],
  templateUrl: './report.component.html',
  styleUrl: './report.component.css',
})
export class ReportComponent implements OnInit, AfterViewInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator; 
  dataSource = new MatTableDataSource<any>([]);
  sucursales: any[] = [];

  displayedColumns: string[] = [
    'sucursal_nombre',
    'numero_factura',
    'fecha',
    'cliente_nombre',
    'total',
    'detalle',
  ];
  columnHeaders: { [key: string]: string } = {
    sucursal_nombre: 'Sucursal',
    numero_factura: 'No. Factura',
    fecha: 'Fecha',
    cliente_nombre: 'Cliente',
    total: 'Total',
    detalle: 'Detalle',
  };

  constructor(
    private invoiceReportService: InvoiceReportService,
    private dialog: MatDialog,
    private cdr: ChangeDetectorRef
  ) {}

  selectedOption: string = 'facturas';
  selectedSucursal: string[] = [];
  startDate: Date | null = null;
  endDate: Date | null = null;
  totalVentas: { [key: string]: number } = {};

  private getAuthToken(): string | null {
    if (typeof window !== 'undefined' && localStorage) {
      return localStorage.getItem('authToken');
    }
    return null;
  }

  loadSucursales(): void {
    const token = this.getAuthToken();

    if (!token) {
      console.error(
        'Token de autenticación no encontrado. Por favor, inicia sesión.'
      );
      return;
    }

    this.invoiceReportService.getSucursales().subscribe({
      next: (data) => {
        this.sucursales = data;
      },
      error: (err) => {
        console.error('Error al cargar las sucursales', err);
      },
    });
  }

  ngOnInit() {
    this.loadSucursales();
  }

  ngAfterViewInit() {
    // Enlazar paginator a dataSource después de que la vista esté lista
    this.dataSource.paginator = this.paginator;
  }
  parseTotal(total: any): number {
    // Asegúrate de que el valor es un número y que no contiene comas
    if (typeof total === 'string') {
      total = total.replace(/[^\d.-]/g, ''); // Elimina caracteres no numéricos
      return parseFloat(total);
    }
    return parseFloat(total);
  }

  onSubmit(): void {
    if (this.startDate && this.endDate && this.selectedSucursal.length > 0) {
      const sucursalesString = this.selectedSucursal.join(',');
  
      const startDateFormatted = this.startDate.toISOString().split('T')[0];
      const endDateFormatted = this.endDate.toISOString().split('T')[0];
  
      console.log('Enviando solicitud al backend con los siguientes parámetros:');
      console.log('Fecha de inicio: ', startDateFormatted);
      console.log('Fecha de fin: ', endDateFormatted);
      console.log('Sucursal(es): ', sucursalesString);
  
      this.invoiceReportService
        .getData(startDateFormatted, endDateFormatted, sucursalesString)
        .subscribe({
          next: (data) => {
            const updatedData = data.map((numero_factura: any) => ({
              ...numero_factura,
              sucursal_id: this.selectedSucursal[0], // Ajuste según necesidad
            }));
  
            this.dataSource.data = updatedData;
  
            // Calcular el total de ventas
            let totalGeneral = 0;
            this.totalVentas = {};
  
            updatedData.forEach((factura: any) => {
              const sucursalId = factura.sucursal_id;
              const totalFactura = this.parseTotal(factura.total);  // Usa la función para asegurar que sea un número
              this.totalVentas[sucursalId] = (this.totalVentas[sucursalId] || 0) + totalFactura;
              totalGeneral += totalFactura;
            });
  
            console.log('Total de ventas por sucursal:', this.totalVentas);
            console.log('Total general de ventas:', totalGeneral);
  
            // Asignar el total general para mostrarlo en la vista
            this.totalVentas['general'] = totalGeneral;
  
            this.cdr.detectChanges();
          },
          error: (err) => {
            console.error('Error al obtener los datos', err);
          },
        });
    } else {
      console.error('Las fechas y al menos una sucursal son obligatorias');
    }
  }
  
  getSucursalNombre(sucursalId: string): string {
    const sucursal = this.sucursales.find((s) => s.id === sucursalId);
    return sucursal ? sucursal.nombre : 'Sucursal Desconocida';
  }

  openInvoiceDetail(numeroFactura: number): void {
    const sucursalSeleccionada = this.sucursales.find(
      (sucursal) => sucursal.id === this.selectedSucursal[0]
    );
    const sucursalNombre = sucursalSeleccionada
      ? sucursalSeleccionada.nombre
      : 'Sucursal Desconocida';

    const dialogData = { numeroFactura, sucursalNombre };

    console.log('Datos enviados al diálogo:', dialogData);

    this.dialog.open(DetailDialogComponent, {
      data: dialogData,
    });
  }
}
