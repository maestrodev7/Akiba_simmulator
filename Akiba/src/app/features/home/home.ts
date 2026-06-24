import { Component, signal, inject } from '@angular/core';
import { Banner } from "../../shared/components/banner/banner";
import { orderListItem } from '../../shared/types/util-interface';
import { OrderList } from "../../shared/components/order-list/order-list";
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { CommonModule } from '@angular/common';
import { RunButton } from "../../shared/components/run-button/run-button";

@Component({
  selector: 'app-home',
  imports: [Banner, OrderList, CommonModule, RunButton],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {

  private router = inject(Router);

  step = signal<number>(1);
  showStepper = signal<boolean>(true);

  constructor() {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.updateStepFromUrl();
    });
    this.updateStepFromUrl();
  }

  private updateStepFromUrl() {
    const url = this.router.url;
    const tree = this.router.parseUrl(url);
    const fragment = tree.fragment;

    this.showStepper.set(!url.includes('payment-step'));
    if (url.includes('second-step-part-two') || fragment === 'step-3') this.step.set(3);
    else if (url.includes('second-step') || fragment === 'step-2') this.step.set(2);
    else if (url.includes('third-step') || fragment === 'step-4') this.step.set(4);
    else if (url.includes('fourth-step') || fragment === 'step-5') this.step.set(5);
    else if (url.includes('fifth-step') || fragment === 'step-6') this.step.set(6);
    else if (url.includes('sixth-step') || fragment === 'step-7') this.step.set(7);
    else if (url.includes('payment-step')) this.step.set(7);
    else if (url.includes('first-step') || fragment === 'step-1') this.step.set(1);
    else this.step.set(1);
  }

  steps = [
    { id: 1, label: 'fiche de renseignements' },
    { id: 2, label: 'Fiche de renseignement du terrain' },
    { id: 3, label: 'Fiche définition projet' },
    { id: 4, label: 'Calendrier prévisionnel des travaux' },
    { id: 5, label: 'Détermination du programme' },
    { id: 6, label: 'Récapitulatif' },
    { id: 7, label: "Estimation financière de votre projet" },
  ];


  nextStep() {
    if (this.step() < 7) {
      this.goToStep(this.step() + 1);
    }
  }

  prevStep() {
    if (this.step() > 1) {
      this.goToStep(this.step() - 1);
    }
  }

  goToStep(step: number) {
    const stepRoutes: { [key: number]: string } = {
      1: 'first-step',
      2: 'second-step',
      3: 'second-step-part-two',
      4: 'third-step',
      5: 'fourth-step',
      6: 'fifth-step',
      7: 'sixth-step'
    };
    this.router.navigate(['/votre-projet', stepRoutes[step]]);
  }

  createProfil: orderListItem[] = [
    {
      headLine: "Identification",
      label: "Saisie de vos coordonnées (nom, email, téléphone)"
    },
    {
      headLine: "Composition familiale",
      label: "Précisez la taille de votre famille pour adapter le projet."
    },
    {
      headLine: "Numéro unique",
      label: "Un identifiant client vous est automatiquement attribué pour centraliser vos futurs terrains et projets."
    },
  ]

  descriveTerrain: orderListItem[] = [
    {
      headLine: "Localisation et superficie",
      label: "Adresse exacte et taille de la parcelle."
    },
    {
      headLine: "Statut juridique",
      label: "Précision sur le titre de propriété ou type de bail."
    },
    {
      headLine: "Configuration du site",
      label: "Topographie (plat ou en pente) et état (terrain nu, maison à réhabiliter ou à démolir)."
    },
    {
      headLine: "Viabilisation",
      label: "Présence de voies d'accès et raccordement aux réseaux."
    },
  ]

  chooseArchitecture: orderListItem[] = [
    {
      headLine: "Type de construction",
      label: "Maison individuelle, villa, immeuble ou piscine."
    },
    {
      headLine: "Style architectural",
      label: "De la villa classique à l'architecture futuriste ou moderne."
    },
    {
      headLine: "Matériaux de structure",
      label: "Choix entre le béton, le parpaing, le bois ou la brique de terre."
    },
    {
      headLine: "Finitions",
      label: "Sélection des types de toiture, des menuiseries (PVC, Alu, Bois) et de l'habillage des façades."
    },
  ]

  configurePiece: orderListItem[] = [
    {
      headLine: "Sélection des espaces",
      label: "Choisissez vos pièces (séjour, chambres, cuisine, garage, etc.) parmi notre catalogue."
    },
    {
      headLine: "Nombre d’unités",
      label: "Déterminez le nombre de chaque pièce souhaitée."
    },
    {
      headLine: "Calcul automatique",
      label: "Le système génère instantanément la surface de plancher (SP) totale de votre projet."
    },
  ]

  obtainEstimation: orderListItem[] = [
    {
      headLine: "Règle de calcul",
      label: "L'estimation est basée sur la surface totale, le standing de finition choisi (standard, moyen ou haut de gamme) et l'indice des matériaux."
    },
    {
      headLine: "Ajustement en temps réel",
      label: "Si le coût ne correspond pas à votre budget, vous pouvez modifier vos choix de matériaux ou de pièces pour recalculer une simulation satisfaisante."
    },

  ]
}
