import { Component, input } from '@angular/core';
import { Product } from '../../../../products/interfaces/product.interface';
import { ProductCarousel } from "../../../../products/components/product-carousel/product-carousel";

@Component({
	selector: 'app-product-details',
	imports: [ProductCarousel],
	templateUrl: './product-details.html',
	styleUrl: './product-details.css'
})
export class ProductDetails {
	product = input.required<Product>();
}
