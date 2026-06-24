import { Component, signal, inject } from '@angular/core';
import { Banner } from "../../shared/components/banner/banner";
import { orderListItem } from '../../shared/types/util-interface';
import { OrderList } from "../../shared/components/order-list/order-list";
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { CommonModule } from '@angular/common';
import { RunButton } from "../../shared/components/run-button/run-button";
import {
  SIMULATOR_STEPS,
  getRouteForStep,
  getStepFromUrl,
  shouldShowStepper,
} from '../simulator-form/simulator-steps.config';

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
  steps = SIMULATOR_STEPS;

  constructor() {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.syncStepFromUrl();
    });
    this.syncStepFromUrl();
  }

  private syncStepFromUrl() {
    const tree = this.router.parseUrl(this.router.url);
    const url = this.router.url;

    this.showStepper.set(shouldShowStepper(url));
    this.step.set(getStepFromUrl(url, tree.fragment));
  }

  nextStep() {
    if (this.step() < this.steps.length) {
      this.goToStep(this.step() + 1);
    }
  }

  prevStep() {
    if (this.step() > 1) {
      this.goToStep(this.step() - 1);
    }
  }

  goToStep(stepId: number) {
    if (stepId < 1 || stepId > this.steps.length) {
      return;
    }

    this.step.set(stepId);
    this.router.navigate(['/votre-projet', getRouteForStep(stepId)]);
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

  billPayement: orderListItem[] = [
    {
      headLine: "Validation du paiement",
      label: "Effectuez le paiement sécurisé des frais de simulation pour lancer le traitement de votre projet."
    },
    {
      headLine: "Ajustement en temps réel",
      label: "L'estimation est basée sur la surface totale, le standing de finition choisi (standard, moyen ou haut de gamme) et l'indice des matériaux."
    },
    {
      headLine: "Fiche synthèse du projet",
      label: "Visualisez votre estimation, puis téléchargez ou imprimez votre fiche synthèse pour la conserver ou la partager."
    },
  ]
}
