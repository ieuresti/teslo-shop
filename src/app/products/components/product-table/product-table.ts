import { Component, inject, input } from '@angular/core';
import { Product } from '../../interfaces/product.interface';
import { ProductImagePipe } from '../../pipes/product-image.pipe';
import { Router, RouterLink } from '@angular/router';
import { CurrencyPipe } from '@angular/common';
import { ProductService } from '../../services/product.service';
import Swal from 'sweetalert2';

@Component({
	selector: 'app-product-table',
	imports: [ProductImagePipe, CurrencyPipe, RouterLink],
	templateUrl: './product-table.html',
	styleUrl: './product-table.css'
})
export class ProductTable {
	products = input.required<Product[]>();
	router = inject(Router);
	productService = inject(ProductService);

	redirectToAction(product: Product, action: string) {
		switch (action) {
			case 'edit':
				this.router.navigate(['/admin/product', product.id]);
				break;
			case 'delete':
				this.onDeleteProduct(product);
				break;
			default:
				console.error('Acción no reconocida');
		}
	}

	onDeleteProduct(product: Product) {
		// TO DO: Implementar endpoint delete
		Swal.fire({
			title: '¿Estás seguro?',
			text: 'Se va a a eliminar el producto ' + product.title,
			icon: 'warning',
			showCancelButton: true,
			confirmButtonColor: '#3085d6',
			cancelButtonColor: '#d33',
			confirmButtonText: 'Sí, eliminar!'
		}).then((result) => {
			if (result.isConfirmed) Swal.fire({
				title: 'Eliminado',
				text: 'El producto ' + product.title + ' fue exitosamente eliminado',
				icon: 'success'
			});
		});
	}
}
