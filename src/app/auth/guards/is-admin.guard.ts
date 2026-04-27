import { inject } from '@angular/core';
import { CanMatchFn, Route, UrlSegment } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { firstValueFrom } from 'rxjs';

export const IsAdminGuard: CanMatchFn = async (
    route: Route,
    segments: UrlSegment[]
) => {
    const authService = inject(AuthService);

    // firstValueFrom se utiliza para convertir el Observable devuelto por checkAuthStatus() en una Promesa, 
    // lo que nos permite usar async/await para esperar su resultado de manera más sencilla
    await firstValueFrom(authService.checkAuthStatus());

    // Retornamos el valor de isAdmin para permitir o bloquear el acceso a las rutas de administración
    // una vez que se ha verificado el estado de autenticación, se evalúa si el usuario tiene el rol de admin
    return authService.isAdmin();
}