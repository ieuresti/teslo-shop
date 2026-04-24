import { Component, inject, signal } from '@angular/core';
import { RouterLink } from "@angular/router";
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { LoginCredentials } from '../../interfaces/login-credentials.interface';

@Component({
	selector: 'app-login-page',
	imports: [RouterLink, ReactiveFormsModule],
	templateUrl: './login-page.html',
	styleUrl: './login-page.css'
})
export class LoginPage {
	authService = inject(AuthService);
	fb = inject(FormBuilder);
	hasError = signal(false);
	isPosting = signal(false);

	loginForm: FormGroup = this.fb.group({
		email: ['', [Validators.required, Validators.email]],
		password: ['', [Validators.required, Validators.minLength(5)]]
	});

	onSubmit() {
		if (this.loginForm.invalid) {
			this.hasError.set(true);
			setTimeout(() => {
				this.hasError.set(false);
			}, 2000);
			return;
		}

		const { email = '', password = '' } = this.loginForm.value;
		const credentials: LoginCredentials = {
			email: email,
			password: password
		};

		this.authService.login(credentials).subscribe({
			next: (resp) => {
				console.log({ resp })
			},
			error: (err) => {
				console.error(err);
			}
		});
	}
}
