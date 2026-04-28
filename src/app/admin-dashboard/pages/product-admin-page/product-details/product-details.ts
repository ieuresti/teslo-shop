import { Component, inject, input, OnInit } from '@angular/core';
import { Product } from '../../../../products/interfaces/product.interface';
import { ProductCarousel } from "../../../../products/components/product-carousel/product-carousel";
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormUtils } from '../../../../utils/form-utils';

@Component({
	selector: 'app-product-details',
	imports: [ProductCarousel, ReactiveFormsModule],
	templateUrl: './product-details.html',
	styleUrl: './product-details.css'
})
export class ProductDetails implements OnInit {
	product = input.required<Product>();
	fb = inject(FormBuilder);

	productForm: FormGroup = this.fb.group({
		title: ['', Validators.required],
		description: ['', Validators.required],
		slug: ['', [Validators.required, Validators.pattern(FormUtils.slugPattern)]],
		price: [0, [Validators.required, Validators.min(0)]],
		stock: [0, [Validators.required, Validators.min(0)]],
		sizes: [['']],
		images: [[]],
		tags: [''],
		gender: ['men', [Validators.required, Validators.pattern(/men|women|kid|unisex/)]]
	});

	ngOnInit(): void {
		this.setFormValue(this.product());
	}

	setFormValue(formLike: Partial<Product>) {
		// Partial<Product> es un tipo que tiene todas las propiedades de Product pero opcionales, lo que nos permite pasar un objeto con solo algunas de las propiedades de Product.
		// Reseteamos el formulario con los datos del producto cuando el componente se inicializa
		this.productForm.reset(this.product());
		this.productForm.patchValue({ tags: formLike.tags?.join(',') });
	}

	onSizeClicked(size: string) {
		const currentSizes: string[] = this.productForm.get('sizes')?.value || [];
		if (currentSizes.includes(size)) {
			// Si el tamaño ya está seleccionado, lo quitamos del array
			this.productForm.get('sizes')?.setValue(currentSizes.filter(s => s !== size));
		} else {
			// Si el tamaño no está seleccionado, lo añadimos al array
			this.productForm.get('sizes')?.setValue([...currentSizes, size]);
		}
	}

	onSubmit() {
		console.log(this.productForm.value)
	}
}
