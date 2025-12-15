import type { STEPS } from '../constants/steps';

export type StepId = (typeof STEPS)[keyof typeof STEPS];

export interface JobApplicationValues {
  personal: Record<string, unknown>;
  experience: Record<string, unknown>;
  role: Record<string, unknown>;
}

export interface FieldErrors {
  [fieldName: string]: string | undefined;
}

export type AsyncStatus = 'idle' | 'loading' | 'succeeded' | 'failed';

export interface AsyncFieldState {
  status: AsyncStatus;
  error: string | null;
}

export type AsyncValidationState = {
  [stepId in StepId]?: {
    [fieldId: string]: AsyncFieldState;
  };
};

export interface JobApplicationState {
  currentStep: StepId;
  values: {
    personal: Record<string, unknown>;
    experience: Record<string, unknown>;
    role: Record<string, unknown>;
  };
  errors: {
    personal: FieldErrors;
    experience: FieldErrors;
    role: FieldErrors;
  };
  asyncValidations: AsyncValidationState;
}
