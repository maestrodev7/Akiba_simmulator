import { Component } from '@angular/core';
import { Banner } from "../../shared/components/banner/banner";
import { orderListItem } from '../../shared/types/util-interface';
import { OrderList } from "../../shared/components/order-list/order-list";

@Component({
  selector: 'app-home',
  imports: [Banner, OrderList],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {
  
  createProfil:orderListItem[]=[
    {
      headLine:"Identification",
      label:"Saisie de vos coordonnées (nom, email, téléphone)"
    },
    {
      headLine:"Composition familiale",
      label:"Précisez la taille de votre famille pour adapter le projet."
    },
    {
      headLine:"Numéro unique",
      label:"Un identifiant client vous est automatiquement attribué pour centraliser vos futurs terrains et projets."
    },
  ]
  
  descriveTerrain:orderListItem[]=[
    {
      headLine:"Localisation et superficie",
      label:"Adresse exacte et taille de la parcelle."
    },
    {
      headLine:"Statut juridique",
      label:"Précision sur le titre de propriété ou type de bail."
    },
    {
      headLine:"Configuration du site",
      label:"Topographie (plat ou en pente) et état (terrain nu, maison à réhabiliter ou à démolir)."
    },
    {
      headLine:"Viabilisation",
      label:"Présence de voies d'accès et raccordement aux réseaux."
    },
  ]
  
  chooseArchitecture:orderListItem[]=[
    {
      headLine:"Type de construction",
      label:"Maison individuelle, villa, immeuble ou piscine."
    },
    {
      headLine:"Style architectural",
      label:"De la villa classique à l'architecture futuriste ou moderne."
    },
    {
      headLine:"Matériaux de structure",
      label:"Choix entre le béton, le parpaing, le bois ou la brique de terre."
    },
    {
      headLine:"Finitions",
      label:"Sélection des types de toiture, des menuiseries (PVC, Alu, Bois) et de l'habillage des façades."
    },
  ]
  
  configurePiece:orderListItem[]=[
    {
      headLine:"Sélection des espaces",
      label:"Choisissez vos pièces (séjour, chambres, cuisine, garage, etc.) parmi notre catalogue."
    },
    {
      headLine:"Nombre d’unités",
      label:"Déterminez le nombre de chaque pièce souhaitée."
    },
    {
      headLine:"Calcul automatique",
      label:"Le système génère instantanément la surface de plancher (SP) totale de votre projet."
    },
  ]
  
  obtainEstimation:orderListItem[]=[
    {
      headLine:"Règle de calcul",
      label:"L'estimation est basée sur la surface totale, le standing de finition choisi (standard, moyen ou haut de gamme) et l'indice des matériaux."
    },
    {
      headLine:"Ajustement en temps réel",
      label:"Si le coût ne correspond pas à votre budget, vous pouvez modifier vos choix de matériaux ou de pièces pour recalculer une simulation satisfaisante."
    },

  ]
}
