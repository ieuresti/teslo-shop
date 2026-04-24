import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { environment } from '../../../environments/environment';
import { catchError, map, Observable, of, tap } from 'rxjs';
import { User } from '../interfaces/user.interface';
import { AuthResponse } from '../interfaces/auth-response.interface';
import { LoginCredentials } from '../interfaces/login-credentials.interface';
import { rxResource } from '@angular/core/rxjs-interop';

type AuthStatus = 'checking' | 'authenticated' | 'not-authenticated';

@Injectable({ providedIn: 'root' })
export class AuthService {
    private http = inject(HttpClient);
    baseUrl = environment.baseUrl;

    private _authStatus = signal<AuthStatus>('checking');
    private _user = signal<User | null>(null);
    private _token = signal<string | null>(null);

    // Recurso para verificar el estado de autenticación al iniciar la aplicación
    checkStatusResource = rxResource({
        params: () => ({}),
        stream: ({ params }) => {
            return this.checkAuthStatus();
        }
    });

    constructor() { }

    authStatus = computed<AuthStatus>(() => {
        if (this._authStatus() == 'checking') {
            return 'checking';
        }

        if (this._user()) {
            return 'authenticated';
        }

        return 'not-authenticated';
    });

    user = computed(() => this._user());

    token = computed(() => this._token());

    login(credentials: LoginCredentials): Observable<boolean> {
        return this.http.post<AuthResponse>(`${this.baseUrl}/auth/login`, credentials).pipe(
            tap(resp => this.handleAuthSuccess(resp)),
            // Si el login es exitoso, retornamos true
            map(() => true),
            // Si el login falla, retornamos false y limpiamos el estatus, el usuario y el token
            catchError((error: any) => this.handleAuthError(error))
        );
    }

    checkAuthStatus(): Observable<boolean> {
        const token = localStorage.getItem('token');
        if (!token) {
            this.logout();
            return of(false);
        }

        return this.http.get<AuthResponse>(`${this.baseUrl}/auth/check-status`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }).pipe(
            tap(resp => this.handleAuthSuccess(resp)),
            map(() => true),
            catchError((error: any) => this.handleAuthError(error))
        );
    }

    logout() {
        this._authStatus.set('not-authenticated');
        this._user.set(null);
        this._token.set(null);

        localStorage.removeItem('token');
    }

    // Método privado para manejar la respuesta exitosa de autenticación, actualizando el estado, el usuario y el token
    private handleAuthSuccess(resp: AuthResponse) {
        this._authStatus.set('authenticated');
        this._user.set(resp.user);
        this._token.set(resp.token);

        localStorage.setItem('token', resp.token);
    }

    // Método privado para manejar errores de autenticación, limpiando el estado, el usuario y el token, y retornando un observable con false
    private handleAuthError(error: any) {
        this.logout();
        return of(false);
    }
}