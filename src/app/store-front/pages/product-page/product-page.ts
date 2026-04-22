import { ProductImagePipe } from './../../../products/pipes/product-image.pipe';
import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from '../../../products/services/product.service';
import { rxResource } from '@angular/core/rxjs-interop';
import { ProductCarousel } from "../../../products/components/product-carousel/product-carousel";

@Component({
	selector: 'app-product-page',
	imports: [ProductCarousel],
	templateUrl: './product-page.html',
	styleUrl: './product-page.css',
})
export class ProductPage {
	activatedRoute = inject(ActivatedRoute);
	productService = inject(ProductService);

	productIdSlug = this.activatedRoute.snapshot.params['idSlug'];

	productResource = rxResource({
		params: () => ({ productIdSlug: this.productIdSlug }),
		stream: ({ params }) => {
			return this.productService.getProductByIdSlug(params.productIdSlug);
		}
	});
}
