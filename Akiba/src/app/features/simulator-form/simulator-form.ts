import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';

@Component({
  selector: 'app-simulator-form',
  imports: [CommonModule],
  templateUrl: './simulator-form.html',
  styleUrl: './simulator-form.css',
})
export class SimulatorForm {
  step = signal<number>(1);

  steps = [
    { id: 1, label: 'fiche de renseignements' },
    { id: 2, label: 'fiche des contraintes et besoins - elements de programmation' },
    { id: 3, label: 'Calendrier prévisionnel des travaux' },
    { id: 4, label: 'Détermination du programme' },
    { id: 5, label: 'Gestion des types de pièces (catalogue)' },
    { id: 6, label: 'Gestion des types de pièces (catalogue)' },
  ];

    // Dans votre classe SimulatorFormComponent
  questions = [
    { label: 'Combien de pièces de séjour voulez-vous ?', value: 1, key: 'sejour' },
    { label: 'Combien de Salle à manger voulez-vous ?', value: 1, key: 'manger' },
    { label: 'Combien de salon voulez-vous ?', value: 1, key: 'salon' },
    { label: 'Combien de Cuisine voulez-vous ?', value: 1, key: 'cuisine' },
    { label: 'Combien de Suite parentale voulez-vous ?', value: 1, key: 'suite' },
    { label: 'Combien de Chambre voulez-vous ?', value: 1, key: 'chambre' },
    { label: 'Combien de Toilettes voulez-vous ?', value: 1, key: 'toilettes' },
    { label: 'Combien de WC voulez-vous ?', value: 1, key: 'wc' },
    { label: 'Combien de Salle de bain voulez-vous ?', value: 1, key: 'sdb' },
    { label: 'Combien de Bureau voulez-vous ?', value: 1, key: 'bureau' },
    { label: 'Combien de Reserve voulez-vous ?', value: 1, key: 'reserve' },
    { label: 'Combien de Véranda voulez-vous ?', value: 1, key: 'veranda' },
    { label: 'Combien de Terrasse voulez-vous ?', value: 1, key: 'terrasse' },
    { label: 'Combien de Balcon voulez-vous ?', value: 1, key: 'balcon' }
  ];

  currentQuestionIndex = 0;

  get currentQuestion() {
    return this.questions[this.currentQuestionIndex];
  }

  nextQuestion() {
    if (this.currentQuestionIndex < this.questions.length - 1) {
      this.currentQuestionIndex++;
    }
  }

  prevQuestion() {
    if (this.currentQuestionIndex > 0) {
      this.currentQuestionIndex--;
    }
  }

updateValue(amount: number) {
  const newValue = this.currentQuestion.value + amount;
  if (newValue >= 0) {
    this.currentQuestion.value = newValue;
  }
}

  nextStep() {
    if (this.step() < 6) {
      this.step.update((step) => step + 1);
    }
  }

  prevStep() {
    if (this.step() > 1) {
      this.step.update((step) => step - 1);
    }
  }

  goToStep(step: number) {
    this.step.set(step);
  }

  submitForm() {
    console.log('Form submitted');
  }
}
