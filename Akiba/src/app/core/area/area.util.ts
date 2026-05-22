export type SuperficieUnite = 'm2' | 'ha';

const HA_TO_M2 = 10_000;

export function toSquareMeters(value: number, unit: SuperficieUnite): number {
  if (unit === 'ha') {
    return Math.round(value * HA_TO_M2 * 100) / 100;
  }
  return value;
}

export function fromSquareMeters(valueM2: number, unit: SuperficieUnite): number {
  if (unit === 'ha') {
    return Math.round((valueM2 / HA_TO_M2) * 10000) / 10000;
  }
  return valueM2;
}

export function formatSuperficie(value: number, unit: SuperficieUnite): string {
  const formatted = Number(value).toLocaleString('fr-FR', {
    maximumFractionDigits: unit === 'ha' ? 4 : 2,
  });
  return unit === 'ha' ? `${formatted} ha` : `${formatted} m²`;
}
