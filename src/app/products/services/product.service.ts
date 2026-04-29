import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Gender, Product, ProductsResponse } from '../interfaces/product.interface';
import { Observable, of, tap } from 'rxjs';
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

    updateProduct(id: string, productLike: Partial<Product>): Observable<Product> {
        return this.http.patch<Product>(`${this.baseUrl}/products/${id}`, productLike).pipe(
            // Después de actualizar el producto en el backend, actualizamos el cache para mantenerlo sincronizado con los datos más recientes
            tap(resp => this.updateProductCache(resp))
        );
    }

    createProduct(productLike: Partial<Product>): Observable<Product> {
        return this.http.post<Product>(`${this.baseUrl}/products`, productLike).pipe(
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
}