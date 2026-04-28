import { Component, inject, input } from '@angular/core';
import { Product } from '../../interfaces/product.interface';
import { ProductImagePipe } from '../../pipes/product-image.pipe';
import { Router, RouterLink } from "@angular/router";
import { CurrencyPipe } from '@angular/common';

@Component({
	selector: 'app-product-table',
	imports: [ProductImagePipe, CurrencyPipe, RouterLink],
	templateUrl: './product-table.html',
	styleUrl: './product-table.css'
})
export class ProductTable {
	products = input.required<Product[]>();
	router = inject(Router);

	redirectToAction(productId: string, action: string) {
		switch (action) {
			case 'view':
				this.router.navigate(['/admin/product', productId]);
				break;
			case 'edit':
				this.router.navigate(['/admin/product', productId]);
				break;
			case 'delete':
				console.log(`Eliminar producto con ID: ${productId}`);
				break;
			default:
				console.error('Acción no reconocida');
		}
	}
}
