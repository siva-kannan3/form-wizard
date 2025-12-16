import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  loadPersistedJobApplication,
  savePersistedJobApplication,
  clearPersistedJobApplication,
} from '../persistence';
import { STORAGE_KEY } from '../../constants/common';
import type { PersistedApp } from '../../types/persistence.types';

describe('job application persistence', () => {
  const mockData: PersistedApp = {
    currentStep: 'personal',
    values: { personal: {}, experience: {}, role: {} },
    errors: {},
    asyncValidations: {},
  };

  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  describe('loadPersistedJobApplication', () => {
    it('returns null when nothing is stored', () => {
      expect(loadPersistedJobApplication()).toBeNull();
    });

    it('returns parsed data when storage has valid JSON', () => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(mockData));

      const result = loadPersistedJobApplication();
      expect(result).toEqual(mockData);
    });

    it('returns null and warns on invalid JSON', () => {
      const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

      localStorage.setItem(STORAGE_KEY, '{ invalid json');

      const result = loadPersistedJobApplication();

      expect(result).toBeNull();
      expect(warnSpy).toHaveBeenCalled();
    });
  });

  describe('savePersistedJobApplication', () => {
    it('saves data to localStorage', () => {
      savePersistedJobApplication(mockData);

      const stored = localStorage.getItem(STORAGE_KEY);
      expect(stored).toBe(JSON.stringify(mockData));
    });

    it('warns if localStorage.setItem throws', () => {
      const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
      vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
        throw new Error('quota exceeded');
      });

      savePersistedJobApplication(mockData);

      expect(warnSpy).toHaveBeenCalled();
    });
  });

  describe('clearPersistedJobApplication', () => {
    it('removes data from localStorage', () => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(mockData));

      clearPersistedJobApplication();

      expect(localStorage.getItem(STORAGE_KEY)).toBeNull();
    });

    it('warns if localStorage.removeItem throws', () => {
      const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
      vi.spyOn(Storage.prototype, 'removeItem').mockImplementation(() => {
        throw new Error('remove failed');
      });

      clearPersistedJobApplication();

      expect(warnSpy).toHaveBeenCalled();
    });
  });
});
