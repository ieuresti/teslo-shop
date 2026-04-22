import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';
import { register } from 'swiper/element/bundle';

register(); // Esto es necesario para registrar los componentes personalizados de Swiper, como <swiper-container> y <swiper-slide>, para que puedan ser utilizados en las plantillas de Angular.
bootstrapApplication(App, appConfig)
	.catch((err) => console.error(err));
