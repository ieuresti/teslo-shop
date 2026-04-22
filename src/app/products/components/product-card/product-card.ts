import { Component, computed, input } from '@angular/core';
import { RouterLink } from "@angular/router";
import { Product } from '../../interfaces/product.interface';
import { CurrencyPipe, SlicePipe } from '@angular/common';

@Component({
	selector: 'app-product-card',
	imports: [RouterLink, SlicePipe, CurrencyPipe],
	templateUrl: './product-card.html',
	styleUrl: './product-card.css'
})
export class ProductCard {
	product = input.required<Product>();

	imageUrl = computed(() => {
		return `http://localhost:3000/api/files/product/${this.product().images[0]}`;
	});
}
