import { Component, ViewChild, AfterViewInit, ChangeDetectorRef, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { SearchInvoiceService, Invoice } from '../../core/services/search-invoice.service';
import { MatButtonModule } from '@angular/material/button'; 
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { DetailDialogComponent } from '../../dialogs/detail-dialog/detail-dialog.component';
import { InvoiceReportService } from '../../core/services/invoice-report.service';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { CdkTableModule } from '@angular/cdk/table';
import { MatSelectModule } from '@angular/material/select';

type ColumnKey = 'noFactura' | 'fecha' | 'documentoCliente' | 'nombreCliente' | 'detalle';

@Component({
  selector: 'app-invoice',
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
    MatNativeDateModule
  ], 
  templateUrl: './invoice.component.html',
  styleUrls: ['./invoice.component.css']
})

export class InvoiceComponent implements OnInit {
  dataSource = new MatTableDataSource<any>([]);

  displayedColumns: string[] = [
    'numero_factura', 'fecha', 'cliente_nombre', 'total', 'detalle'
  ];
  columnHeaders: { [key: string]: string } = {  
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
  startDate: Date | null = null;
  endDate: Date | null = null;

  onSubmit(): void {
    if (this.startDate && this.endDate) {
      const startDateFormatted = this.startDate.toISOString().split('T')[0];
      const endDateFormatted = this.endDate.toISOString().split('T')[0];
      
      console.log('Enviando solicitud al backend con los siguientes parámetros:');
      console.log('Fecha de inicio: ', startDateFormatted);
      console.log('Fecha de fin: ', endDateFormatted);
      
      this.invoiceReportService
        .getDataVendedor(
          this.selectedOption,
          startDateFormatted,
          endDateFormatted
        )
        .subscribe({
          next: (data) => {
            this.dataSource.data = data;
            console.log('Datos recibidos del servidor:', data);
            this.cdr.detectChanges();
          },
          error: (err) => {
            console.error('Error al obtener los datos', err);
          },
        });
    } else {
      console.error('Las fechas son obligatorias');
    }
  }

  ngOnInit() {}

  openInvoiceDetail(numeroFactura: number): void {
    this.dialog.open(DetailDialogComponent, {
      data: { numeroFactura }
    });
  }
}