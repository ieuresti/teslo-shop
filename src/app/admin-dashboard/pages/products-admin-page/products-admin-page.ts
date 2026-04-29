import { Component, inject, signal } from '@angular/core';
import { ProductTable } from "../../../products/components/product-table/product-table";
import { rxResource } from '@angular/core/rxjs-interop';
import { ProductService } from '../../../products/services/product.service';
import { PaginatorService } from '../../../shared/components/paginator/paginator.service';
import { Paginator } from "../../../shared/components/paginator/paginator";
import { RouterLink } from "@angular/router";

@Component({
	selector: 'app-products-admin-page',
	imports: [ProductTable, Paginator, RouterLink],
	templateUrl: './products-admin-page.html',
	styleUrl: './products-admin-page.css'
})
export class ProductsAdminPage {
	productsService = inject(ProductService);
	paginatorService = inject(PaginatorService);
	productsPerPages = signal(10);

	productsResource = rxResource({
		params: () => ({ 
			page: (this.paginatorService.currentPage() - 1) * this.productsPerPages(),
			limit: this.productsPerPages() 
		}),
		stream: ({ params }) => {
			return this.productsService.getProducts({
				offset: params.page,
				limit: params.limit
			});
		}
	});
}
