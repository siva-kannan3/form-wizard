import { STEPS } from '../constants/steps';
import type { StepId } from '../types/store.types';

export const STEP_ORDER: StepId[] = [STEPS.PERSONAL, STEPS.EXPERIENCE, STEPS.ROLE, STEPS.REVIEW];

export function isStepId(s: string | undefined): s is StepId {
  return !!s && (STEP_ORDER as string[]).includes(s);
}

export function getNextStep(current: StepId): StepId | null {
  const i = STEP_ORDER.indexOf(current);
  return i >= 0 && i < STEP_ORDER.length - 1 ? STEP_ORDER[i + 1] : null;
}

export function getPreviousStep(current: StepId): StepId | null {
  const i = STEP_ORDER.indexOf(current);
  return i > 0 ? STEP_ORDER[i - 1] : null;
}
