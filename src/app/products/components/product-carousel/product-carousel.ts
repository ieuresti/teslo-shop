import { Navigation, Pagination } from 'swiper/modules';
import { AfterViewInit, Component, CUSTOM_ELEMENTS_SCHEMA, ElementRef, input, viewChild } from '@angular/core';
import Swiper from 'swiper';
import { ProductImagePipe } from '../../pipes/product-image.pipe';

@Component({
	selector: 'app-product-carousel',
	schemas: [CUSTOM_ELEMENTS_SCHEMA],
	imports: [ProductImagePipe],
	templateUrl: './product-carousel.html',
	styleUrl: './product-carousel.css'
})
export class ProductCarousel implements AfterViewInit {
	images = input.required<string[]>();
	swiperDiv = viewChild.required<ElementRef>('swiperDiv');

	ngAfterViewInit(): void {
		const element = this.swiperDiv().nativeElement;
		if (!element) {
			return;
		}

		new Swiper(element, {
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
