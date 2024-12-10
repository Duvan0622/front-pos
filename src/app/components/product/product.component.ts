import { Component, ViewChild, AfterViewInit, OnInit } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatPaginator } from '@angular/material/paginator';
import { SearchProductService, Product } from '../../core/services/search-product.service';
import { MatButtonModule } from '@angular/material/button'; 
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-product',
  standalone: true,
  imports: [
    MatIcon,
    MatPaginator, 
    MatSelectModule, 
    FormsModule, 
    MatIconModule, 
    MatFormFieldModule, 
    MatTableModule, 
    MatInputModule, 
    CommonModule,         
    FormsModule,   
    MatButtonModule 
  ],
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})

export class ProductComponent implements OnInit, AfterViewInit {
  data: Product[] = []; 
  displayedColumns = ['id', 'nombre', 'precio_formateado', 'stock']; 
  columnHeaders: { [key: string]: string } = {
    id: 'Código',
    nombre: 'Nombre',
    precio_formateado: 'Precio',
    stock: 'Stock'
  }; 
  dataSource = new MatTableDataSource<Product>(this.data); 

  @ViewChild(MatPaginator) paginator!: MatPaginator; 
  private searchSubject = new Subject<string>(); 

  constructor(private productService: SearchProductService) {}

  ngOnInit() {
    this.searchSubject.pipe(debounceTime(300)).subscribe(query => {
      this.fetchProducts(query); 
    });
    this.fetchProducts();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  applyFilter(event: Event) {
    const query = (event.target as HTMLInputElement).value.trim();
    this.searchSubject.next(query); 
  }

  fetchProducts(query?: string): void {
    this.productService.searchProducts(query).subscribe({
      next: (data) => {
        this.data = data; 
        console.log('Productos recuperados:', this.data); 
        if (query) {
          
          this.dataSource.data = this.data.filter((product) =>
            product.nombre.toLowerCase().includes(query.toLowerCase())
          );
        } else {
          
          this.dataSource.data = this.data;
        }
        console.log('Productos en dataSource:', this.dataSource.data);
      },
      error: (err) => {
        console.error('Error al cargar los productos:', err);
      }
    });
  }
}