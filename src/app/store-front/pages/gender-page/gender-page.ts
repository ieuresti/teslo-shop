import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from '../../../products/services/product.service';
import { rxResource, toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
import { ProductCard } from "../../../products/components/product-card/product-card";
import { Paginator } from "../../../shared/components/paginator/paginator";
import { PaginatorService } from '../../../shared/components/paginator/paginator.service';

@Component({
	selector: 'app-gender-page',
	imports: [ProductCard, Paginator],
	templateUrl: './gender-page.html',
	styleUrl: './gender-page.css',
})
export class GenderPage {
	activatedRoute = inject(ActivatedRoute);
	productService = inject(ProductService);
	paginatorService = inject(PaginatorService);

	// Convertimos el observable de parámetros de ruta en una señal reactiva para obtener el género actual
	// Usamos una señal porque queremos que la UI se actualice automáticamente cada vez que cambie el género en la URL
	gender = toSignal(this.activatedRoute.params.pipe(
		// Con el operador map extraemos el género de los parámetros de la ruta
		map(({ gender }) => gender)
	));

	productsResource = rxResource({
		params: () => ({
			gender: this.gender(),
			page: this.paginatorService.currentPage() - 1
		}),
		stream: ({ params }) => {
			return this.productService.getProducts({
				gender: params.gender,
				offset: params.page * 9
			});
		}
	});
}
