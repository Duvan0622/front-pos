import { Component, OnInit } from '@angular/core';
import { SearchProductService, Product } from '../../core/services/search-product.service';
import { SearchClientService, Client } from '../../core/services/search-client.service';
import { StartSaleService, SaleRequest, SaleResponse } from '../../core/services/start-sale.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface AddedProduct {
  product: Product;
  cantidad: number;
}

@Component({
  selector: 'app-sale',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './sale.component.html',
  styleUrls: ['./sale.component.css']
})
export class SaleComponent implements OnInit {
  constructor(
    private searchProductService: SearchProductService,
    private searchClientService: SearchClientService,
    private startSaleService: StartSaleService
  ) {}

  formattedDate: string = '';
  products: any[] = [];
  filteredData: any[] = [];
  searchText: string = '';
  selectedFilter: string = 'nombre';
  cliente: Client | null = null;
  documento: string = '';
  errorMessage: string = '';
  addedProducts: AddedProduct[] = [];
  errorMessagep: string = '';
  quantity: number = 1;
  hoveredRow: number | null = null;
  editIndex: number | null = null;
  errorMessagei: string | null = null;
  saleResponse: SaleResponse | null = null;

  ngOnInit(): void {
    this.setCurrentDateTime();
    this.loadProducts();
  }

  // Establece la fecha y hora actual
  setCurrentDateTime(): void {
    const currentDate = new Date();
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: '2-digit' };
    this.formattedDate = currentDate.toLocaleDateString('es-ES', options);
  }

  // Carga los productos desde el servicio
  loadProducts(): void {
    this.searchProductService.searchProducts().subscribe({
      next: (data) => {
        this.products = data;
        this.filteredData = data;
      },
      error: (err) => {
        console.error('Error al cargar los productos:', err);
      }
    });
  }

  // Filtra los productos según el texto de búsqueda
  filterProducts(): void {
    if (!this.searchText) {
      this.filteredData = this.products;
    } else {
      this.filteredData = this.products.filter((product) => {
        const value = this.selectedFilter === 'nombre'
          ? product.nombre.toLowerCase()
          : product.id.toString();
        return value.includes(this.searchText.toLowerCase());
      });
    }
  }

  // Busca un cliente según el documento proporcionado
  onSearchClient(): void {
    if (this.documento.length > 0) {
      this.searchClientService.searchClient(this.documento).subscribe(
        (client) => {
          this.cliente = client;
          this.errorMessage = '';
        },
        (error) => {
          this.cliente = null;
          this.errorMessage = 'Cliente no encontrado';
          console.error(error);
        }
      );
    } else {
      this.cliente = null;
      this.errorMessage = '';
    }
  }

  // Selecciona y agrega un producto a la lista de productos añadidos
  selectAndAddProduct(product: Product, quantity: number): void {
    if (quantity <= 0) {
      this.errorMessagep = 'Ingrese un número mayor que 0.';
      return;
    }

    if (quantity > product.stock) {
      this.errorMessagep = `Stock insuficiente. ${product.stock} unidades disponibles.`;
      return;
    }

    this.addedProducts.push({ product, cantidad: quantity });
    product.stock -= quantity;
    this.quantity = 1;
    this.errorMessagep = '';
  }

  showDeleteIcon(index: number): void {
    this.hoveredRow = index;
  }

  hideDeleteIcon(index: number): void {
    if (this.hoveredRow === index) {
      this.hoveredRow = null;
    }
  }

  // Elimina un producto de la lista y restaura su stock
  removeProduct(index: number): void {
    const removedProduct = this.addedProducts[index];
    removedProduct.product.stock += removedProduct.cantidad;
    this.addedProducts.splice(index, 1);
  }

  // Inicia la edición de la cantidad de un producto
  editQuantity(index: number): void {
    this.editIndex = index;
    this.errorMessagei = null;
  }

  // Guarda la cantidad editada de un producto
  saveQuantity(index: number): void {
    const product = this.addedProducts[index].product;
    let cantidad = this.addedProducts[index].cantidad;

    if (cantidad <= 0) {
      cantidad = 1;
      this.errorMessagei = 'Ingrese un número mayor que 0.';
    }

    if (cantidad > product.stock) {
      this.errorMessagei = `Stock insuficiente. ${product.stock} unidades disponibles.`;
      cantidad = 1;
    }

    this.addedProducts[index].cantidad = cantidad;
    this.editIndex = null;
  }

  // Calcula el total de la venta
  calculateTotal(): number {
    return this.addedProducts.reduce((total, item) => total + (item.cantidad * item.product.precio), 0);
  }

  // Guarda la factura
  guardarFactura(): void {
    if (!this.cliente) {
      this.errorMessage = 'Debe seleccionar un cliente antes de guardar la factura.';
      return;
    }

    if (this.addedProducts.length === 0) {
      this.errorMessagep = 'Debe agregar al menos un producto para generar la factura.';
      return;
    }

    const saleRequest: SaleRequest = {
      cliente_id: this.cliente.id,
      productos: this.addedProducts.map((item) => ({
        producto_id: item.product.id,
        cantidad: item.cantidad
      }))
    };

    this.startSaleService.startSale(saleRequest).subscribe({
      next: (response) => {
        this.saleResponse = response;
        alert(`Factura generada con éxito. Número: ${response.numero_factura}`);
        this.resetForm();
      },
      error: (err) => {
        console.error('Error al guardar la factura:', err);
        alert('Ocurrió un error al generar la factura. Intente nuevamente.');
      }
    });
  }

  // Restablece el formulario
  resetForm(): void {
    this.cliente = null;
    this.documento = '';
    this.addedProducts = [];
    this.errorMessage = '';
    this.errorMessagep = '';
    this.saleResponse = null;
  }
}
