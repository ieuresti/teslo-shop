import { Component, computed, inject, signal } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../auth/services/auth.service';

@Component({
	selector: 'app-admin-dashboard-layout',
	imports: [RouterOutlet, RouterLink, RouterLinkActive],
	templateUrl: './admin-dashboard-layout.html',
	styleUrl: './admin-dashboard-layout.css'
})
export class AdminDashboardLayout {
	authService = inject(AuthService);

	user = computed(() => this.authService.user());
	isSidebarOpen = signal(false);

	toggleSidebar() {
		// Cambia el estado de isSidebarOpen al valor opuesto (true a false o viceversa)
		this.isSidebarOpen.update(prev => !prev);
	}

	closeSidebar() {
		this.isSidebarOpen.set(false);
	}
}
