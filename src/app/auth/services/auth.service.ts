import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Observable, tap } from 'rxjs';
import { User } from '../interfaces/user.interface';
import { AuthResponse } from '../interfaces/auth-response.interface';
import { LoginCredentials } from '../interfaces/login-credentials.interface';

type AuthStatus = 'checking' | 'authenticated' | 'not-authenticated';

@Injectable({ providedIn: 'root' })
export class AuthService {
    private http = inject(HttpClient);
    baseUrl = environment.baseUrl;

    private _authStatus = signal<AuthStatus>('checking');
    private _user = signal<User | null>(null);
    private _token = signal<string | null>(null);

    constructor() { }

    authStatus = computed<AuthStatus>(() => {
        if (this._authStatus() == 'checking') {
            return 'checking';
        }

        if (this._user()) {
            return 'authenticated'
        }

        return 'not-authenticated';
    });

    user = computed(() => this._user());

    token = computed(() => this._token());

    login(credentials: LoginCredentials): Observable<AuthResponse> {
        return this.http.post<AuthResponse>(`${this.baseUrl}/auth/login`, credentials).pipe(
            tap(resp => {
                this._authStatus.set('authenticated');
                this._user.set(resp.user);
                this._token.set(resp.token);

                localStorage.setItem('token', resp.token);
            })
        );
    }
}