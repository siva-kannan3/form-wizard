import type { RootState } from '../../../store';
import type { AsyncFieldState, StepId } from '../types/store.types';

export const getCurrentStep = (state: RootState) => state.jobApplication.currentStep;

export const getStepErrors = (state: RootState) => state.jobApplication.errors;

export const getStepValues = (state: RootState) => state.jobApplication.values;

export const getAsyncFieldState =
  (step: StepId, fieldId: string) =>
  (state: RootState): AsyncFieldState => {
    return (
      state.jobApplication.asyncValidations[step]?.[fieldId] ?? {
        status: 'idle',
        error: null,
      }
    );
  };
