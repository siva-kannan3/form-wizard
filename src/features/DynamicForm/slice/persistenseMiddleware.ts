import { type Middleware } from '@reduxjs/toolkit';
import { savePersistedJobApplication } from '../utils/persistence';

import {
  updatePersonalField,
  updateExperienceField,
  updateRoleField,
  addPortfolioUrl,
  updatePortfolioUrl,
  deletePortfolioUrl,
  setCurrentStep,
  resetApplication,
} from './jobApplicationSlice';
import { debounce } from '../utils/common';
import type { RootState } from '../../../store';
import { JOB_APPLICATION_LOCAL_STORAGE_VERSION } from '../constants/common';
import type { PersistedApp } from '../types/persistence.types';

const TRIGGER_ACTIONS = new Set([
  updatePersonalField.type,
  updateExperienceField.type,
  updateRoleField.type,
  addPortfolioUrl.type,
  updatePortfolioUrl.type,
  deletePortfolioUrl.type,
  setCurrentStep.type,
  resetApplication.type,
]);

const debouncedSave = debounce((state: RootState) => {
  const payload: PersistedApp = {
    values: state.jobApplication.values,
    currentStep: state.jobApplication.currentStep,
    version: JOB_APPLICATION_LOCAL_STORAGE_VERSION,
    updatedAt: new Date().toISOString(),
  };
  savePersistedJobApplication(payload);
}, 1000);

export const persistMiddleware: Middleware = (store) => (next) => (action) => {
  const result = next(action);

  if (TRIGGER_ACTIONS.has(action.type)) {
    debouncedSave(store.getState());
  }

  return result;
};
