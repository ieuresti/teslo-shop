import { HttpHandlerFn, HttpRequest } from "@angular/common/http";
import { inject } from "@angular/core";
import { AuthService } from "../services/auth.service";

// Interceptor para añadir el token de autenticación a las peticiones HTTP
export function authInterceptor(req: HttpRequest<unknown>, next: HttpHandlerFn) {
    // Obtenemos el token desde el servicio de autenticación
    const token = inject(AuthService).token();
    // Cloneamos la petición y le añadimos el token en el header 'X-Authentication-Token'
    const newReq = req.clone({
        headers: req.headers.append('Authorization', `Bearer ${token}`),
    });
    // Continuamos con la petición clonada, que ahora incluye el token en los headers
    return next(newReq);
}