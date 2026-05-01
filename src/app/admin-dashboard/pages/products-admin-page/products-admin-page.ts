import { Component, inject, signal, computed } from '@angular/core';
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
	searchTerm = signal('');

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

	// Computed que devuelve los productos filtrados según el término de búsqueda ingresado por el usuario, 
	// actualizándose automáticamente cada vez que cambia el término de búsqueda o la lista de productos obtenida del recurso
	productosFiltrados = computed(() => {
		// Obtenemos el término de búsqueda actual, lo convertimos a minúsculas y eliminamos espacios al inicio y final para hacer una búsqueda más flexible
		const termino = this.searchTerm().toLowerCase().trim();
		// Obtenemos todos los productos del recurso, si no hay productos disponibles devolvemos un array vacío
		const allProducts = this.productsResource.value()?.products || [];

		if (termino.length === 0) {
			// Si el término de búsqueda está vacío, devolvemos todos los productos sin filtrar
			return allProducts;
		}

		// Filtramos los productos cuyo título incluya el término de búsqueda, ignorando mayúsculas y espacios al inicio o final del término de búsqueda
		return allProducts.filter(p => p.title.toLowerCase().includes(termino));
	});

	// La función buscar se llama cada vez que el usuario escribe en el campo de búsqueda o presiona Enter,
	// actualizando el signal searchTerm con el nuevo valor del término de búsqueda, 
	// lo que a su vez hace que el computed productosFiltrados se vuelva a calcular y actualice la lista de productos mostrada en la tabla
	buscar(termino: string) {
		this.searchTerm.set(termino);
	}
}
