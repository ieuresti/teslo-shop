import { Component, signal } from '@angular/core';

@Component({
	selector: 'app-front-navbar',
	imports: [],
	templateUrl: './front-navbar.html',
	styleUrl: './front-navbar.css',
})
export class FrontNavbar {
	mostrarCarritoCompras = signal(false);
}
