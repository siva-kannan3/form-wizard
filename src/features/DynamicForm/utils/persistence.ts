import type { JobApplicationValues, StepId } from '../slice/jobApplicationSlice';

export const STORAGE_KEY = 'job-app-state-v1';

export type PersistedApp = {
  values: JobApplicationValues;
  currentStep: StepId;
  version: number;
  updatedAt: string;
};

export function loadPersistedJobApplication(): PersistedApp | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as PersistedApp;
  } catch (e) {
    console.warn('Failed to load persisted job application data', e);
    return null;
  }
}

export function savePersistedJobApplication(payload: PersistedApp) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  } catch (e) {
    console.warn('Failed to persist job application data', e);
  }
}

export function clearPersistedJobApplication() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (e) {
    console.warn('Failed to delete the job data', e);
  }
}
