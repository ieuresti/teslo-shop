import { Pipe, PipeTransform } from '@angular/core';
import { environment } from '../../../environments/environment';

@Pipe({
    name: 'productImage'
})

export class ProductImagePipe implements PipeTransform {
    transform(value: string | string[]): string {
        const baseUrl = environment.baseUrl;

        if (typeof value == 'string') {
            // Si el valor es un string, se asume que es la URL de la imagen y se devuelve directamente
            return `${baseUrl}/files/product/${value}`;
        }

        const image = value.at(0); // Obtener la primera imagen del array

        if (!image) {
            // Si no hay imágenes, se devuelve una imagen por defecto
            return '/assets/images/no-image.jpg';
        }

        // De lo contrario, se devuelve la URL de la primera imagen
        return `${baseUrl}/files/product/${image}`;
    }
}