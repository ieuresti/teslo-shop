import { Component, inject } from '@angular/core';
import { ProductCard } from "../../../products/components/product-card/product-card";
import { ProductService } from '../../../products/services/product.service';
import { rxResource, toSignal } from '@angular/core/rxjs-interop';
import { Paginator } from "../../../shared/components/paginator/paginator";
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs';

@Component({
	selector: 'app-home-page',
	imports: [ProductCard, Paginator],
	templateUrl: './home-page.html',
	styleUrl: './home-page.css',
})
export class HomePage {
	productsService = inject(ProductService);
	activatedRoute = inject(ActivatedRoute);

	currentPage = toSignal(this.activatedRoute.queryParamMap.pipe(
		// Obtenemos el valor del parámetro 'page' de la URL. Si no existe, se asigna 1 por defecto.
		map(params => (params.get('page') ? + params.get('page')! : 1)),
		// Si el valor obtenido no es un número (NaN), se asigna 1 por defecto.
		map(page => (isNaN(page) ? 1 : page))
	), {
		// Valor inicial para currentPage, en caso de que el observable no emita ningún valor o emita un valor no válido.
		initialValue: 1
	}
	);

	productsResource = rxResource({
		params: () => ({ page: this.currentPage() - 1 }),
		stream: ({ params }) => {
			return this.productsService.getProducts({
				offset: params.page * 9
			});
		}
	});
}
