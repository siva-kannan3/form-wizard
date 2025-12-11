import type { JobApplicationValues, StepId } from './store.types';

export type PersistedApp = {
  values: JobApplicationValues;
  currentStep: StepId;
  version: number;
  updatedAt: string;
};
