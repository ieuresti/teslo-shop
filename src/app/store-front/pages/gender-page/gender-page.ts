import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from '../../../products/services/product.service';
import { rxResource, toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
import { ProductCard } from "../../../products/components/product-card/product-card";

@Component({
	selector: 'app-gender-page',
	imports: [ProductCard],
	templateUrl: './gender-page.html',
	styleUrl: './gender-page.css',
})
export class GenderPage {
	activatedRoute = inject(ActivatedRoute);
	productService = inject(ProductService);

	// Convertimos el observable de parámetros de ruta en una señal reactiva para obtener el género actual
	// Usamos una señal porque queremos que la UI se actualice automáticamente cada vez que cambie el género en la URL
	gender = toSignal(this.activatedRoute.params.pipe(
		// Con el operador map extraemos el género de los parámetros de la ruta
		map(({ gender }) => gender)
	));

	productsResource = rxResource({
		params: () => ({ gender: this.gender() }),
		stream: ({ params }) => {
			return this.productService.getProducts({
				gender: params.gender
			});
		}
	});
}
