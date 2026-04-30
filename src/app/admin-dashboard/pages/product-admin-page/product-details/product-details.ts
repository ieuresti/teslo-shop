import { Component, computed, inject, input, OnInit, signal } from '@angular/core';
import { Product } from '../../../../products/interfaces/product.interface';
import { ProductCarousel } from "../../../../products/components/product-carousel/product-carousel";
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormUtils } from '../../../../utils/form-utils';
import { FormErrorLabel } from "../../../../shared/components/form-error-label/form-error-label";
import { ProductService } from '../../../../products/services/product.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
	selector: 'app-product-details',
	imports: [ProductCarousel, ReactiveFormsModule, FormErrorLabel],
	templateUrl: './product-details.html',
	styleUrl: './product-details.css'
})
export class ProductDetails implements OnInit {
	product = input.required<Product>();
	fb = inject(FormBuilder);
	router = inject(Router);
	productService = inject(ProductService);

	sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

	imageFileList: FileList | undefined = undefined;
	tempImages = signal<string[]>([]);
	imagesToCarousel = computed(() => {
		// Combinamos las imágenes del producto con las imágenes temporales para mostrar en el carrusel, 
		// esto nos permite mostrar un preview de las imágenes seleccionadas antes de subirlas al servidor
		const currentProductImages = [...this.product().images, ...this.tempImages()];
		return currentProductImages;
	});

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

	onFilesChanged(event: Event) {
		const fileListUploaded = (event.target as HTMLInputElement).files;

		if (fileListUploaded) {
			this.imageFileList = fileListUploaded;
			const files = Array.from(fileListUploaded);
			const tempUrls = files.map(file => URL.createObjectURL(file));
			this.tempImages.set(tempUrls);
		}
	}

	onSubmit() {
		const isFormValid = this.productForm.valid;
		this.productForm.markAllAsTouched();
		if (!isFormValid) {
			return;
		}

		const formValue = this.productForm.value;
		// Creamos un objeto productLike a partir de los valores del formulario
		const productLike: Partial<Product> = {
			// Usamos el operador spread para copiar todas las propiedades del formulario al nuevo objeto
			...formValue,
			// Convertimos el string de tags en un array de strings, separando por comas y eliminando espacios en blanco
			tags: formValue.tags.split(',').map((tag: string) => tag.trim())
		};

		if (this.product().id == 'new') {
			this.productService.createProduct(productLike, this.imageFileList).subscribe({
				next: (resp) => {
					Swal.fire({
						title: 'Éxito',
						text: 'Producto ' + resp.title + ' creado correctamente',
						icon: 'success',
						showCloseButton: true,
					}).then(() => {
						this.router.navigate(['/admin/product/', resp.id]);
					});
				},
				error: (err) => {
					Swal.fire({
						title: 'Error',
						text: 'Hubo un error al crear el producto',
						icon: 'error',
						showCloseButton: true,
					});
				}
			});
		} else {
			this.productService.updateProduct(this.product().id, productLike, this.imageFileList).subscribe({
				next: (resp) => {
					Swal.fire({
						title: 'Éxito',
						text: 'Producto ' + resp.title + ' actualizado correctamente',
						icon: 'success',
						showCloseButton: true,
					}).then(() => {
						this.router.navigate(['/admin/product/', resp.id]);
					});
				},
				error: (err) => {
					Swal.fire({
						title: 'Error',
						text: 'Hubo un error al actualizar el producto',
						icon: 'error',
						showCloseButton: true,
					});
				}
			});
		}
	}
}
