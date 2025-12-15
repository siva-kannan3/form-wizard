import { createAsyncThunk } from '@reduxjs/toolkit';
import type { StepId } from '../types/store.types';
import type { AsyncValidatorFn } from '../types/jobApplication.types';

type AsyncValidationSuccessPayload = {
  step: StepId;
  fieldId: string;
};

type AsyncValidationErrorPayload = {
  step: StepId;
  fieldId: string;
  error: string;
};

type AsyncValidationArgs = {
  step: StepId;
  fieldId: string;
  value: unknown;
  validator: AsyncValidatorFn;
};

export const runAsyncFieldValidation = createAsyncThunk<
  AsyncValidationSuccessPayload,
  AsyncValidationArgs,
  { rejectValue: AsyncValidationErrorPayload }
>(
  'jobApplication/runAsyncFieldValidation',
  async ({ step, fieldId, value, validator }, { signal, rejectWithValue }) => {
    try {
      const result = await validator(value, signal);

      if (!result.ok) {
        return rejectWithValue({
          step,
          fieldId,
          error: result.reason,
        });
      }

      return { step, fieldId };
    } catch (err) {
      return rejectWithValue({
        step,
        fieldId,
        error: 'Async validation failed' + err,
      });
    }
  },
);
