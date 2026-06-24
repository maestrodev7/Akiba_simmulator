/** Champs à sélection unique (une seule valeur). */
export const STEP_TWO_SINGLE_CHOICE_FIELDS = [
  'type_produit',
  'nature_travaux',
  'type_construction',
  'materiaux',
  'style_construction',
  'type_toiture',
  'habillage_facade',
  'menuiserie',
  'securisation_ouvertures',
] as const;

export type StepTwoSingleChoiceField = (typeof STEP_TWO_SINGLE_CHOICE_FIELDS)[number];

export function normalizeSingleChoice(value: unknown): string | null {
  if (Array.isArray(value)) {
    const items = value
      .map((item) => (item != null ? String(item).trim() : ''))
      .filter((item) => item !== '');
    return items.length > 0 ? items[0] : null;
  }
  if (value != null && String(value).trim() !== '') {
    return String(value).trim();
  }
  return null;
}

export function normalizeMultiChoice(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value
      .map((item) => (item != null ? String(item).trim() : ''))
      .filter((item) => item !== '');
  }
  if (value != null && String(value).trim() !== '') {
    return [String(value).trim()];
  }
  return [];
}
