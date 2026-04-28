import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Product, ProductsResponse } from '../interfaces/product.interface';
import { Observable, of, tap } from 'rxjs';
import { environment } from '../../../environments/environment';

interface Options {
    limit?: number;
    offset?: number;
    gender?: string;
}

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
        const key = `${id}`;
        if (this.productCache.has(key)) {
            return of(this.productCache.get(key)!);
        }
        return this.http.get<Product>(`${this.baseUrl}/products/${id}`).pipe(
            tap(resp => this.productCache.set(key, resp))
        );
    }
}