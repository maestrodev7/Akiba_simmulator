export interface SimulatorStep {
  id: number;
  label: string;
  route: string;
  homeFragment: string;
}

export const PAYMENT_STEP_ROUTE = 'payment-step';

export const SIMULATOR_STEPS: SimulatorStep[] = [
  { id: 1, label: 'fiche de renseignements', route: 'first-step', homeFragment: 'step-1' },
  { id: 2, label: 'Fiche de renseignement du terrain', route: 'second-step', homeFragment: 'step-2' },
  { id: 3, label: 'Fiche définition projet', route: 'second-step-part-two', homeFragment: 'step-3' },
  { id: 4, label: 'Détermination du programme', route: 'fourth-step', homeFragment: 'step-4' },
  { id: 5, label: 'Calendrier prévisionnel des travaux', route: 'third-step', homeFragment: 'step-5' },
  { id: 6, label: 'Récapitulatif', route: 'fifth-step', homeFragment: 'step-6' },
  { id: 7, label: 'Estimation financière de votre projet', route: 'sixth-step', homeFragment: 'step-7' },
];

const STEPS_BY_ROUTE_LENGTH = [...SIMULATOR_STEPS].sort(
  (a, b) => b.route.length - a.route.length
);

export function getStepFromUrl(url: string, fragment: string | null): number {
  if (url.includes(PAYMENT_STEP_ROUTE)) {
    return 7;
  }

  for (const step of STEPS_BY_ROUTE_LENGTH) {
    if (url.includes(step.route)) {
      return step.id;
    }
  }

  if (fragment) {
    const match = SIMULATOR_STEPS.find((step) => step.homeFragment === fragment);
    if (match) {
      return match.id;
    }
  }

  return 1;
}

export function getRouteForStep(stepId: number): string {
  const step = SIMULATOR_STEPS.find((s) => s.id === stepId);
  return step?.route ?? 'first-step';
}

export function shouldShowStepper(url: string): boolean {
  return !url.includes(PAYMENT_STEP_ROUTE);
}
