import { Navigation, Pagination } from 'swiper/modules';
import { AfterViewInit, Component, CUSTOM_ELEMENTS_SCHEMA, ElementRef, input, OnChanges, SimpleChanges, viewChild } from '@angular/core';
import Swiper from 'swiper';
import { ProductImagePipe } from '../../pipes/product-image.pipe';

@Component({
	selector: 'app-product-carousel',
	schemas: [CUSTOM_ELEMENTS_SCHEMA],
	imports: [ProductImagePipe],
	templateUrl: './product-carousel.html',
	styleUrl: './product-carousel.css'
})
export class ProductCarousel implements AfterViewInit, OnChanges {
	images = input.required<string[]>();
	swiperDiv = viewChild.required<ElementRef>('swiperDiv');

	swiper: Swiper | null = null;

	ngOnChanges(changes: SimpleChanges): void {
		if (changes['images'].firstChange) {
			// Si es la primera vez que se asignan las imágenes, no hacemos nada porque el carrusel aún no se ha inicializado
			return;
		}

		if (!this.swiper) {
			// Si el carrusel no está inicializado, no hacemos nada porque se inicializará con las nuevas imágenes en ngAfterViewInit
			return;
		}

		// Destruimos el carrusel para eliminar la instancia anterior y evitar problemas de renderizado con las nuevas imágenes
		this.swiper.destroy(true, true);

		// Limpiamos el contenido del paginador para que se vuelva a renderizar con las nuevas imágenes
		const paginatorElement: HTMLDivElement = this.swiperDiv().nativeElement?.querySelector('.swiper-pagination');
		paginatorElement.innerHTML = '';

		setTimeout(() => {
			// Re-inicializamos el carrusel para que se renderice con las nuevas imágenes, el setTimeout es necesario para esperar a que Angular actualice el DOM con las nuevas imágenes antes de inicializar el carrusel
			this.swiperInit();
		}, 100);
	}

	ngAfterViewInit(): void {
		this.swiperInit();
	}

	swiperInit() {
		const element = this.swiperDiv().nativeElement;
		if (!element) {
			return;
		}

		this.swiper = new Swiper(element, {
			// Optional parameters
			direction: 'horizontal',
			loop: true,
			modules: [Navigation, Pagination],

			// If we need pagination
			pagination: {
				el: '.swiper-pagination',
			},

			// Navigation arrows
			navigation: {
				nextEl: '.swiper-button-next',
				prevEl: '.swiper-button-prev',
			},

			// And if we need scrollbar
			scrollbar: {
				el: '.swiper-scrollbar',
			},
		});
	}
}
