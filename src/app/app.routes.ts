import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: 'auth',
        loadChildren: () => import('./auth/auth.routes').then(m => m.authRoutes),
        // TO DO guards...
    },
    {
        path: '',
        loadChildren: () => import('./store-front/store-front.routes').then(m => m.storeFrontRoutes)
    }
];
