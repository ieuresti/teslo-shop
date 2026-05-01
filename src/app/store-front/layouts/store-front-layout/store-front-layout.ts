import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FrontNavbar } from "../../components/front-navbar/front-navbar";
import { Footer } from "../../../shared/components/footer/footer";

@Component({
	selector: 'app-store-front-layout',
	imports: [RouterOutlet, FrontNavbar, Footer],
	templateUrl: './store-front-layout.html',
	styleUrl: './store-front-layout.css'
})
export class StoreFrontLayout { }
