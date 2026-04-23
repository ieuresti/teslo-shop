import { Component, computed, input, linkedSignal, signal } from '@angular/core';
import { RouterLink } from "@angular/router";

@Component({
	selector: 'app-paginator',
	imports: [RouterLink],
	templateUrl: './paginator.html',
	styleUrl: './paginator.css'
})
export class Paginator {
	// Input que recibe la página actual desde el componente padre.
	currentPage = input<number>(1);

	// Input que recibe el número total de páginas disponibles.
	pages = input(0);

	/**
	 * - linkedSignal(source) crea un signal que lee y escribe en el signal source.
	 * - Cualquier cambio en currentPage() actualiza automáticamente activePage().
	 * - Si modificas activePage.set(valor), también actualiza currentPage (si el input lo permite).
	 */
	activePage = linkedSignal(this.currentPage);

	// computed que genera una lista de números de página basada en el número total de páginas.
	getPagesList = computed(() => {
		// Array.from({ length: this.pages() }, (_, i) => i + 1) crea un array con números del 1 al número de páginas.
		return Array.from(
			{ length: this.pages() },
			// El segundo argumento de Array.from es una función que se llama para cada índice del array.
			// Aquí, simplemente devuelve el número de página correspondiente (índice + 1).
			(_, i) => i + 1
		);
	});
}
