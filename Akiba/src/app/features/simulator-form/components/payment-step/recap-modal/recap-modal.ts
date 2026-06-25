import {
  Component,
  Input,
  Output,
  EventEmitter,
  inject,
  computed,
  signal,
  OnInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProjectData } from '../../../../../services/project-data/project-data';
import { YourProject } from '../../../../../services/project/your-project';
import { CurrencyService } from '../../../../../core/currency/currency.service';
import { ProjectRecapData } from '../../../../../interfaces/project-interface';
import { catchError, finalize, timeout } from 'rxjs/operators';
import { of } from 'rxjs';
import { formatSuperficie } from '../../../../../core/area/area.util';

@Component({
  selector: 'app-recap-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './recap-modal.html',
  styleUrl: './recap-modal.css',
})
export class RecapModal implements OnInit {
  @Output() close = new EventEmitter<void>();

  private projectDataService = inject(ProjectData);
  private projectService = inject(YourProject);
  private currencyService = inject(CurrencyService);

  recap = signal<ProjectRecapData | null>(null);
  isLoading = signal<boolean>(false);

  get projectData() {
    return this.projectDataService.getProjectData();
  }

  get stepOne() {
    return this.projectData.stepOne?.data;
  }
  get stepTwo() {
    return this.projectData.stepTwo?.data;
  }
  get stepThree() {
    return this.projectData.stepThree?.data;
  }

  /** Reference projet — uses client_id or terrain_id */
  get referenceProjet(): string {
    const pd = this.projectData;
    return pd.client_id ?? pd.terrain_id ?? '—';
  }

  get nomComplet(): string {
    const s1 = this.stepOne;
    if (!s1) return '—';
    return `${s1.prenom ?? ''} ${s1.nom ?? ''}`.trim() || '—';
  }

  get telephone(): string {
    return this.stepOne?.telephone ?? '—';
  }

  get adresseClient(): string {
    return this.stepOne?.adresse ?? '—';
  }

  get localisation(): string {
    return this.stepTwo?.adresse ?? '—';
  }

  get superficie(): string {
    const s2 = this.stepTwo;
    if (!s2 || s2.superficie == null) return '—';
    return formatSuperficie(Number(s2.superficie), s2.superficie_unite ?? 'm2');
  }

  get budgetLabel(): string {
    const s2 = this.stepTwo;
    if (!s2) return '—';
    const xaf = Number(s2.budget_previsionnel ?? 0);
    return this.currencyService.format(xaf, 'XAF');
  }

  // ── Définition du projet ──────────────────────────────────────────────────

  get natureTravaux(): string {
    return this.joinField(this.stepTwo?.nature_travaux);
  }

  get typeConstruction(): string {
    return this.joinField(this.stepTwo?.type_construction);
  }

  get configuration(): string {
    const etages = Number(this.stepTwo?.nombre_etages ?? 0);
    if (etages === 0) return 'Projet de plain-pied';
    return `Projet de plain-pied ou à ${etages} étage${etages > 1 ? 's' : ''}`;
  }

  get styleArchitectural(): string {
    const style = this.stepTwo?.style_construction;
    if (Array.isArray(style)) return style.join(' • ');
    return style ?? '—';
  }

  get materiaux(): string {
    return this.joinField(this.stepTwo?.materiaux);
  }

  get typeToiture(): string {
    return this.joinField(this.stepTwo?.type_toiture);
  }

  get menuiserie(): string {
    return this.joinField(this.stepTwo?.menuiserie);
  }

  get securisationOuvertures(): string {
    return this.joinField(this.stepTwo?.securisation_ouvertures);
  }

  // ── Programme fonctionnel ─────────────────────────────────────────────────

  get pieces(): { nombre: number; designation: string }[] {
    return (this.recap()?.lignes ?? []).map((l) => ({
      nombre: l.nombre,
      designation: l.piece_designation,
    }));
  }

  get espaceAnnexe(): string[] {
    const raw = this.stepTwo?.espace_annexe;
    return Array.isArray(raw) ? raw : raw ? [String(raw)] : [];
  }

  // ── Calendrier ────────────────────────────────────────────────────────────

  get dateDebut(): string {
    return this.formatDate(this.stepThree?.date_debut_travaux);
  }

  get dateFin(): string {
    return this.formatDate(this.stepThree?.date_fin_travaux);
  }

  // ── Helpers ───────────────────────────────────────────────────────────────

  private joinField(value: unknown): string {
    if (Array.isArray(value)) return value.join(' • ') || '—';
    return value ? String(value) : '—';
  }

  private formatDate(raw?: string | null): string {
    if (!raw) return '—';
    try {
      return new Date(raw).toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      });
    } catch {
      return raw;
    }
  }

  ngOnInit() {
    this.loadRecap();
  }

  private loadRecap() {
    const produitId = this.projectData?.produit_id;
    if (!produitId) return;
    this.isLoading.set(true);
    this.projectService
      .getProjectRecap(produitId)
      .pipe(
        timeout(10000),
        catchError(() => of(null)),
        finalize(() => this.isLoading.set(false))
      )
      .subscribe({
        next: (res) => {
          if (res?.success && res.data) this.recap.set(res.data);
        },
      });
  }

  onClose() {
    this.close.emit();
  }

  onDownload() {
    window.print();
  }
}
