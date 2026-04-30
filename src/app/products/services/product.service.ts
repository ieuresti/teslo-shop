import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Gender, Product, ProductsResponse } from '../interfaces/product.interface';
import { forkJoin, map, Observable, of, switchMap, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { User } from '../../auth/interfaces/user.interface';

interface Options {
    limit?: number;
    offset?: number;
    gender?: string;
}

const emptyProduct: Product = {
    id: 'new',
    title: '',
    price: 0,
    description: '',
    slug: '',
    stock: 0,
    sizes: [],
    gender: Gender.Men,
    tags: [],
    images: [],
    user: {} as User
};

@Injectable({ providedIn: 'root' })
export class ProductService {
    private http = inject(HttpClient);
    baseUrl = environment.baseUrl;

    // Cache para almacenar los productos obtenidos
    private productsCache = new Map<string, ProductsResponse>();
    private productCache = new Map<string, Product>();

    constructor() { }

    getProducts(options: Options): Observable<ProductsResponse> {
        // Desestructuramos las opciones con valores por defecto
        const { limit = 9, offset = 0, gender = '' } = options;

        const key = `${limit}-${offset}-${gender}`; // Creamos una clave única para el cache basada en los parámetros de la consulta
        // Verificamos si los productos para esta consulta ya están en el cache
        if (this.productsCache.has(key)) {
            // Si están en el cache, los devolvemos como un observable usando 'of'
            return of(this.productsCache.get(key)!);
        }

        return this.http.get<ProductsResponse>(`${this.baseUrl}/products`, {
            params: {
                limit: limit,
                offset: offset,
                gender: gender
            }
        }).pipe(
            tap(resp => console.log(resp)),
            // Al obtener la respuesta, la almacenamos en el cache para futuras consultas con los mismos parámetros
            tap(resp => this.productsCache.set(key, resp))
        );
    }

    getProductByIdSlug(term: string): Observable<Product> {
        const key = `${term}`;
        if (this.productCache.has(key)) {
            return of(this.productCache.get(key)!);
        }
        return this.http.get<Product>(`${this.baseUrl}/products/${term}`).pipe(
            tap(resp => this.productCache.set(key, resp))
        );
    }

    getProductById(id: string): Observable<Product> {
        if (id == 'new') {
            return of(emptyProduct);
        }

        const key = `${id}`;
        if (this.productCache.has(key)) {
            return of(this.productCache.get(key)!);
        }
        return this.http.get<Product>(`${this.baseUrl}/products/${id}`).pipe(
            tap(resp => this.productCache.set(key, resp))
        );
    }

    updateProduct(id: string, productLike: Partial<Product>, imageFileList?: FileList): Observable<Product> {
        const currentImages = productLike.images ?? [];

        return this.uploadImages(imageFileList).pipe(
            // Combinamos las imágenes existentes del producto con las nuevas imágenes seleccionadas (si las hay) para enviar al backend un objeto con todas las imágenes actualizadas
            map(imageNames => ({
                ...productLike,
                images: [...currentImages, ...imageNames]
            })),
            // Usamos switchMap para esperar a que se complete la carga de imágenes y luego hacer la petición de actualización del producto al backend con los datos actualizados, incluyendo las nuevas imágenes subidas
            switchMap(updatedProduct =>
                this.http.patch<Product>(`${this.baseUrl}/products/${id}`, updatedProduct)
            ),
            // Después de actualizar el producto en el backend, actualizamos el cache para mantenerlo sincronizado con los datos más recientes
            tap(resp => this.updateProductCache(resp))
        )
    }

    createProduct(productLike: Partial<Product>, imageFileList?: FileList): Observable<Product> {
        return this.uploadImages(imageFileList).pipe(
            // Combinamos los datos del producto con las imágenes subidas para enviar al backend un objeto completo con toda la información necesaria para crear el producto, incluyendo las URLs de las imágenes subidas
            map(imageNames => ({
                ...productLike,
                images: imageNames
            })),
            // Usamos switchMap para esperar a que se complete la carga de imágenes y luego hacer la petición de creación del producto al backend con los datos completos, incluyendo las imágenes subidas
            switchMap(createdProduct =>
                this.http.post<Product>(`${this.baseUrl}/products`, createdProduct)
            ),
            // Después de crear el producto en el backend, actualizamos el cache para mantenerlo sincronizado con los datos más recientes
            tap(resp => this.updateProductCache(resp))
        );
    }

    private updateProductCache(product: Product) {
        const productId = product.id;
        // Actualizamos el producto en el cache individual
        this.productCache.set(productId, product);

        // Actualizamos el producto en el cache de productos listados
        this.productsCache.forEach((productResponse) => {
            const productIndex = productResponse.products.findIndex(p => p.id === productId);
            if (productIndex !== -1) {
                // Si encontramos el producto en la lista, lo actualizamos con los nuevos datos
                productResponse.products[productIndex] = product;
            }
        });
    }

    uploadImages(images?: FileList): Observable<string[]> {
        if (!images || images.length === 0) {
            return of([]);
        }

        // Creamos un array de observables para cada imagen que se va a subir, usando el método 'uploadImage' para cada archivo
        const uploadObservables = Array.from(images).map(imageFile => this.uploadImage(imageFile));

        // Usamos forkJoin para esperar a que todas las cargas de imágenes se completen y devolver un array con las URLs de las imágenes subidas
        return forkJoin(uploadObservables).pipe(
            tap(urls => console.log('Imágenes subidas:', urls))
        );
    }

    uploadImage(imageFile: File): Observable<string> {
        // Creamos un FormData para enviar el archivo al servidor, ya que la mayoría de los servidores esperan los archivos en este formato para las cargas de archivos
        const formData = new FormData();
        formData.append('file', imageFile);

        return this.http.post<{ fileName: string }>(`${this.baseUrl}/files/product`, formData).pipe(
            // En este ejemplo, asumimos que el servidor devuelve un objeto con una propiedad 'fileName' que contiene la URL de la imagen subida.
            map(resp => resp.fileName)
        );
    }
}