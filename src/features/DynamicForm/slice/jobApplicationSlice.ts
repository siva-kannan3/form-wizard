import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { STEPS } from '../constants/steps';
import type {
  AsyncStatus,
  FieldErrors,
  JobApplicationState,
  JobApplicationValues,
  StepId,
} from '../types/store.types';
import { runAsyncFieldValidation } from './thunks';

const initialState: JobApplicationState = {
  currentStep: STEPS.PERSONAL,
  values: {
    personal: {},
    experience: {},
    role: {},
  },
  errors: {
    personal: {},
    experience: {},
    role: {},
  },
  asyncValidations: {},
};

export const jobApplicationSlice = createSlice({
  name: 'jobApplication',
  initialState,
  reducers: {
    setValuesFromLocalStorage(
      state,
      action: PayloadAction<
        Partial<{
          values: Partial<JobApplicationValues>;
          currentStep: StepId;
        }>
      >,
    ) {
      const payload = action.payload;
      if (!payload) return;

      if (payload.values) {
        state.values = {
          ...state.values,
          ...payload.values,
        };
      }

      if (payload.currentStep) {
        state.currentStep = payload.currentStep;
      }
    },

    setCurrentStep(state, action: PayloadAction<StepId>) {
      state.currentStep = action.payload;
    },

    setStepErrors(
      state,
      action: PayloadAction<{
        step: typeof STEPS.PERSONAL | typeof STEPS.EXPERIENCE | typeof STEPS.ROLE;
        errors: FieldErrors;
      }>,
    ) {
      const { step, errors } = action.payload;
      state.errors[step] = errors;
    },

    resetApplication(state) {
      Object.assign(state, initialState);
    },

    setFieldValue(
      state,
      action: PayloadAction<{
        step: Exclude<StepId, 'review'>;
        fieldId: string;
        value: unknown;
      }>,
    ) {
      state.values[action.payload.step][action.payload.fieldId] = action.payload.value;
    },

    addArrayItem(
      state,
      action: PayloadAction<{ step: Exclude<StepId, 'review'>; fieldId: string }>,
    ) {
      const arr = (state.values[action.payload.step][action.payload.fieldId] ?? []) as unknown[];
      arr.push('');
      state.values[action.payload.step][action.payload.fieldId] = arr;
    },

    updateArrayItem(
      state,
      action: PayloadAction<{
        step: Exclude<StepId, 'review'>;
        fieldId: string;
        index: number;
        value: unknown;
      }>,
    ) {
      const arr = state.values[action.payload.step][action.payload.fieldId] as unknown[];
      arr[action.payload.index] = action.payload.value;
    },

    removeArrayItem(
      state,
      action: PayloadAction<{ step: Exclude<StepId, 'review'>; fieldId: string; index: number }>,
    ) {
      const arr = state.values[action.payload.step][action.payload.fieldId] as unknown[];
      arr.splice(action.payload.index, 1);
    },

    setAsyncValidationState(
      state,
      action: PayloadAction<{
        step: StepId;
        fieldId: string;
        status: AsyncStatus;
        error?: string | null;
      }>,
    ) {
      const { step, fieldId, status, error = null } = action.payload;

      if (!state.asyncValidations[step]) {
        state.asyncValidations[step] = {};
      }

      state.asyncValidations[step]![fieldId] = { status, error };
    },

    clearAsyncValidation(state, action: PayloadAction<{ step: StepId; fieldId: string }>) {
      delete state.asyncValidations[action.payload.step]?.[action.payload.fieldId];
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(runAsyncFieldValidation.pending, (state, action) => {
        const { step, fieldId } = action.meta.arg;

        state.asyncValidations[step] ??= {};
        state.asyncValidations[step]![fieldId] = {
          status: 'loading',
          error: null,
        };
      })
      .addCase(runAsyncFieldValidation.fulfilled, (state, action) => {
        const { step, fieldId } = action.payload;

        state.asyncValidations[step]![fieldId] = {
          status: 'succeeded',
          error: null,
        };
      })
      .addCase(runAsyncFieldValidation.rejected, (state, action) => {
        const payload = action.payload as
          | { step: StepId; fieldId: string; error: string }
          | undefined;

        if (!payload) return;

        state.asyncValidations[payload.step]![payload.fieldId] = {
          status: 'failed',
          error: payload.error,
        };
      });
  },
});

export const {
  setCurrentStep,
  setStepErrors,
  resetApplication,
  setFieldValue,
  setAsyncValidationState,
  clearAsyncValidation,
  addArrayItem,
  updateArrayItem,
  removeArrayItem,

  setValuesFromLocalStorage,
} = jobApplicationSlice.actions;

export default jobApplicationSlice.reducer;
