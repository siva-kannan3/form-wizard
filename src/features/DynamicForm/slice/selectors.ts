import type { RootState } from '../../../store';

export const getCurrentStep = (state: RootState) => state.jobApplication.currentStep;

export const getStepErrors = (state: RootState) => state.jobApplication.errors;

export const getStepValues = (state: RootState) => state.jobApplication.values;

export const getAsyncEmailState = (state: RootState) => state.jobApplication.asyncValidations.email;
