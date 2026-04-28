import { Component, effect, inject } from '@angular/core';
import { rxResource, toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../../../products/services/product.service';
import { map } from 'rxjs';
import { ProductDetails } from './product-details/product-details';

@Component({
	selector: 'app-product-admin-page',
	imports: [ProductDetails],
	templateUrl: './product-admin-page.html',
	styleUrl: './product-admin-page.css'
})
export class ProductAdminPage {
	activatedRoute = inject(ActivatedRoute);
	router = inject(Router);
	productService = inject(ProductService);

	// Convertimos el observable de parámetros de ruta en una señal reactiva para obtener el id
	productId = toSignal(this.activatedRoute.params.pipe(
		// Con el operador map extraemos el id de los parámetros de la ruta
		map((params) => params['id'])
	));

	productResource = rxResource({
		params: () => ({ productId: this.productId() }),
		stream: ({ params }) => {
			return this.productService.getProductById(params.productId);
		}
	});

	// Un effect es como poner un vigilante watching una señal. Cuando la señal cambia, el vigilante hace algo.
	// Recomendable para manejar efectos secundarios externos como redirecciones, localStorage, llamadas a la API, etc.
	redirectEffect = effect(() => {
		if (this.productResource.error()) {
			this.router.navigate(['/admin/products']);
		}
	});
}
