import { inject, Injectable } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class PaginatorService {
    private activatedRoute = inject(ActivatedRoute);

    currentPage = toSignal(this.activatedRoute.queryParamMap.pipe(
        // Obtenemos el valor del parámetro 'page' de la URL. Si no existe, se asigna 1 por defecto.
        map(params => (params.get('page') ? + params.get('page')! : 1)),
        // Si el valor obtenido no es un número (NaN), se asigna 1 por defecto.
        map(page => (isNaN(page) ? 1 : page))
    ), {
        // Valor inicial para currentPage, en caso de que el observable no emita ningún valor o emita un valor no válido.
        initialValue: 1
    }
    );

}