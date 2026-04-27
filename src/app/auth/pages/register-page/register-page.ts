import { Component, inject, signal } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Register } from '../../interfaces/register.interface';

@Component({
	selector: 'app-register-page',
	imports: [ReactiveFormsModule, RouterLink],
	templateUrl: './register-page.html',
	styleUrl: './register-page.css'
})
export class RegisterPage {
	authService = inject(AuthService);
	router = inject(Router);
	fb = inject(FormBuilder);
	hasError = signal(false);

	registerForm: FormGroup = this.fb.group({
		fullName: ['', Validators.required],
		email: ['', [Validators.required, Validators.email]],
		password: ['', [Validators.required, Validators.minLength(5)]]
	});

	onSubmit() {
		if (this.registerForm.invalid) {
			this.hasError.set(true);
			setTimeout(() => {
				this.hasError.set(false);
			}, 2000);
			return;
		}

		const { fullName = '', email = '', password = '' } = this.registerForm.value;
		const credentials: Register = {
			fullName: fullName,
			email: email,
			password: password
		};

		this.authService.register(credentials).subscribe({
			next: (isAuthenticated) => {
				if (isAuthenticated) {
					this.router.navigateByUrl('/');
					return;
				}

				this.hasError.set(true);
				setTimeout(() => {
					this.hasError.set(false);
				}, 2000);
			},
			error: (err) => {
				console.error(err);
			}
		});
	}
}
