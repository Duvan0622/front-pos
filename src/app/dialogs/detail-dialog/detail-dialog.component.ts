import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatTableModule } from '@angular/material/table';
import { InvoiceReportService } from '../../core/services/invoice-report.service';
import { MatDialogModule } from '@angular/material/dialog';

@Component({
  selector: 'app-detail-dialog',
  standalone: true,
  imports: [MatTableModule, CommonModule, MatDialogModule],
  templateUrl: './detail-dialog.component.html',
  styleUrl: './detail-dialog.component.css'
})
export class DetailDialogComponent {
  displayedColumns: string[] = ['producto_id', 'producto_nombre', 'cantidad', 'precio_unitario', 'precio_total'];
  dataSource: any[] = [];
  total: string = '$0.00';

  constructor(
    private dialogRef: MatDialogRef<DetailDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { numeroFactura: number, sucursalNombre: string },
    private invoiceReportService: InvoiceReportService
  ) {
    this.loadInvoiceDetails();
  }

  facturaData: any; 
  
  loadInvoiceDetails(): void {
    console.log('Datos recibidos en el diálogo:', this.data);
  
    this.invoiceReportService.getInvoiceDetail(this.data.numeroFactura).subscribe({
      next: (response) => {
        this.facturaData = response;
        this.dataSource = response.detalles;
        this.total = response.total;
        console.log('Datos de la factura cargados:', response); 
      },
      error: (err) => console.error('Error al cargar los detalles de la factura:', err)
    });
  }
  
  close(): void {
    this.dialogRef.close();
  }

  loadInvoiceDetailsV(): void {
    this.invoiceReportService.getInvoiceDetail(this.data.numeroFactura).subscribe({
      next: (response) => {
        this.facturaData = response;
        this.dataSource = response.detalles;
        this.total = response.total;
      },
      error: (err) => console.error('Error al cargar los detalles de la factura', err)
    });
  }
  
}


