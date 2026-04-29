import { Component, input } from '@angular/core';
import { AbstractControl, ValidationErrors } from '@angular/forms';
import { FormUtils } from '../../../utils/form-utils';

@Component({
	selector: 'app-form-error-label',
	imports: [],
	templateUrl: './form-error-label.html',
	styleUrl: './form-error-label.css'
})
export class FormErrorLabel {
	// El control es el formulario o campo del formulario al que queremos mostrar los errores
	control = input.required<AbstractControl>();

	get errorMessage() {
		// Obtenemos los errores del control. Si no hay errores, devolvemos un objeto vacío para evitar errores al intentar acceder a las propiedades de un objeto null o undefined.
		const errors: ValidationErrors = this.control().errors || {};

		// Si el control ha sido tocado (touched) y tiene errores, devolvemos el mensaje de error correspondiente. 
		// Si no, devolvemos null para no mostrar ningún mensaje.
		return this.control().touched && Object.keys(errors).length > 0
			? FormUtils.getTextError(errors)
			: null;
	}
}
