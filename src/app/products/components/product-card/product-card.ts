import { Component, computed, input } from '@angular/core';
import { RouterLink } from "@angular/router";
import { Product } from '../../interfaces/product.interface';
import { CurrencyPipe, SlicePipe } from '@angular/common';
import { ProductImagePipe } from '../../pipes/product-image.pipe';

@Component({
	selector: 'app-product-card',
	imports: [RouterLink, SlicePipe, CurrencyPipe, ProductImagePipe],
	templateUrl: './product-card.html',
	styleUrl: './product-card.css'
})
export class ProductCard {
	product = input.required<Product>();
}
