import { inject } from '@angular/core';
import { CanMatchFn, Route, Router, UrlSegment } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { firstValueFrom } from 'rxjs';

export const NotAuthenticatedGuard: CanMatchFn = async(
    route: Route,
    segments: UrlSegment[]
) => {
    const authService = inject(AuthService);
    const router = inject(Router);

    // firstValueFrom se utiliza para convertir el Observable devuelto por checkAuthStatus() en una Promesa, 
    // lo que nos permite usar async/await para esperar su resultado de manera más sencilla
    const isAuthenticated = await firstValueFrom(authService.checkAuthStatus());

    if (isAuthenticated) {
        // Si el usuario está autenticado, redirigimos a la página principal y bloqueamos el acceso a las rutas de autenticación
        router.navigateByUrl('/');
        // Retornamos false para bloquear el acceso a las rutas de autenticación
        return false;
    }
    // Si el usuario no está autenticado, permitimos el acceso a las rutas de autenticación
    return true;
}