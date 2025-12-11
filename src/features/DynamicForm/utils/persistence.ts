import { STORAGE_KEY } from '../constants/common';
import type { PersistedApp } from '../types/persistence.types';

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
