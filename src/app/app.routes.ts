import { Routes } from '@angular/router';
import { NotAuthenticatedGuard } from './auth/guards/not-authenticated.guard';

export const routes: Routes = [
    {
        path: 'auth',
        loadChildren: () => import('./auth/auth.routes').then(m => m.authRoutes),
        // El guard `NotAuthenticatedGuard` se encarga de proteger las rutas de autenticación, permitiendo el acceso solo a usuarios no autenticados
        canMatch: [NotAuthenticatedGuard]
    },
    {
        path: 'admin',
        loadChildren: () => import('./admin-dashboard/admin-dashboard.routes').then(m => m.adminDashboardRoutes),
        // TO DO Guard
        //canMatch: []
    },
    {
        path: '',
        loadChildren: () => import('./store-front/store-front.routes').then(m => m.storeFrontRoutes)
    }
];
