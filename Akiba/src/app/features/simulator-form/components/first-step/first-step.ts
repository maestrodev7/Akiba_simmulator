import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { ErrorMessage } from '../../../../shared/components/error-message/error-message';

@Component({
  selector: 'app-first-step',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ErrorMessage],
  templateUrl: './first-step.html',
  styleUrl: './first-step.css',
})
export class FirstStep {
  @Output() next = new EventEmitter<FormGroup>();
  @Output() prev = new EventEmitter<void>();
  private fb = inject(FormBuilder);

  form: FormGroup = this.fb.group({
    nom: ['', Validators.required],
    prenom: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    telephone: ['', [Validators.required, Validators.pattern('^[+0-9\\s]+$')]],
    adresse: ['', Validators.required],
    numero_registre: ['', Validators.required],
  });

  getErrorMessage(controlName: string): string {
    const control = this.form.get(controlName);
    if (control && control.invalid && control.touched) {
      if (control.errors?.['required']) return 'Ce champ est requis.';
      if (control.errors?.['email']) return 'Veuillez entrer une adresse e-mail valide.';
      if (control.errors?.['pattern']) return 'Veuillez entrer un format valide.';
    }
    return '';
  }

  onSubmit(){
    console.log("form value send from child component",this.form.value);
    if (this.form.valid) {
      this.next.emit(this.form);
    }
  }
}
