import { Component, inject } from '@angular/core';
import { ProductCard } from "../../../products/components/product-card/product-card";
import { ProductService } from '../../../products/services/product.service';
import { rxResource } from '@angular/core/rxjs-interop';
import { Paginator } from "../../../shared/components/paginator/paginator";
import { PaginatorService } from '../../../shared/components/paginator/paginator.service';

@Component({
	selector: 'app-home-page',
	imports: [ProductCard, Paginator],
	templateUrl: './home-page.html',
	styleUrl: './home-page.css',
})
export class HomePage {
	productsService = inject(ProductService);
	paginatorService = inject(PaginatorService);

	productsResource = rxResource({
		params: () => ({ page: this.paginatorService.currentPage() - 1 }),
		stream: ({ params }) => {
			return this.productsService.getProducts({
				offset: params.page * 9
			});
		}
	});
}
