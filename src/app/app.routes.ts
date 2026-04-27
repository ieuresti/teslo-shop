import { Routes } from '@angular/router';
import { NotAuthenticatedGuard } from './auth/guards/not-authenticated.guard';
import { IsAdminGuard } from './auth/guards/is-admin.guard';

export const routes: Routes = [
    {
        path: 'auth',
        loadChildren: () => import('./auth/auth.routes').then(m => m.authRoutes),
        // * Si un guard retorna true, la navegación continúa hacia la ruta solicitada.
        // * Si un guard retorna false, la navegación se cancela y el usuario permanece en su ubicación actual.
        canMatch: [NotAuthenticatedGuard]
    },
    {
        path: 'admin',
        loadChildren: () => import('./admin-dashboard/admin-dashboard.routes').then(m => m.adminDashboardRoutes),
        canMatch: [IsAdminGuard]
    },
    {
        path: '',
        loadChildren: () => import('./store-front/store-front.routes').then(m => m.storeFrontRoutes)
    }
];
