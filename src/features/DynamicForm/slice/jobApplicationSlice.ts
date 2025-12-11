import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { STEPS } from '../constants/steps';
import type {
  AsyncStatus,
  ExperienceData,
  FieldErrors,
  JobApplicationState,
  JobApplicationValues,
  PersonalData,
  RoleData,
  StepId,
} from '../types/store.types';
import { checkEmailUniqueThunk } from './thunks';

const initialState: JobApplicationState = {
  currentStep: STEPS.PERSONAL,
  values: {
    personal: {
      name: '',
      phone: '',
      email: '',
      location: '',
    },
    experience: {
      yoe: undefined,
      mentorshipRequired: false,
      teamLead: false,
      primaryTechStack: '',
    },
    role: {
      role: undefined,
      reactYoe: undefined,
      portfolioUrls: [],
      nodeYoe: undefined,
      automationExperience: undefined,
    },
  },
  errors: {
    personal: {},
    experience: {},
    role: {},
  },
  asyncValidations: {
    email: { status: 'idle', error: null },
  },
};

type PersonalFieldName = keyof PersonalData;
type ExperienceFieldName = keyof ExperienceData;
type RoleFieldName = keyof RoleData;

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

    addPortfolioUrl(state) {
      state.values.role.portfolioUrls.push('');
    },

    updatePortfolioUrl(state, action: PayloadAction<{ index: number; value: string }>) {
      const { index, value } = action.payload;
      if (state.values.role.portfolioUrls[index] !== undefined) {
        state.values.role.portfolioUrls[index] = value;
      }
    },

    deletePortfolioUrl(state, action: PayloadAction<{ index: number }>) {
      const { index } = action.payload;
      state.values.role.portfolioUrls.splice(index, 1);
    },

    updatePersonalField(state, action: PayloadAction<{ field: PersonalFieldName; value: any }>) {
      const { field, value } = action.payload;
      state.values.personal = {
        ...state.values.personal,
        [field]: value,
      };
    },

    updateExperienceField(
      state,
      action: PayloadAction<{ field: ExperienceFieldName; value: any }>,
    ) {
      const { field, value } = action.payload;
      state.values.experience = {
        ...state.values.experience,
        [field]: value,
      };
    },

    updateRoleField(state, action: PayloadAction<{ field: RoleFieldName; value: any }>) {
      const { field, value } = action.payload;
      state.values.role = {
        ...state.values.role,
        [field]: value,
      };
    },

    setAsyncEmailState(
      state,
      action: PayloadAction<{
        status: AsyncStatus;
        error?: string | null;
      }>,
    ) {
      state.asyncValidations.email.status = action.payload.status;
      state.asyncValidations.email.error = action.payload.error ?? null;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(checkEmailUniqueThunk.pending, (state) => {
        state.asyncValidations.email.status = 'loading';
        state.asyncValidations.email.error = null;
      })
      .addCase(checkEmailUniqueThunk.fulfilled, (state) => {
        state.asyncValidations.email.status = 'succeeded';
        state.asyncValidations.email.error = null;
      })
      .addCase(checkEmailUniqueThunk.rejected, (state, action) => {
        state.asyncValidations.email.status = 'failed';
        state.asyncValidations.email.error = action.payload?.reason ?? 'error';
      });
  },
});

export const {
  setCurrentStep,
  setStepErrors,
  resetApplication,
  addPortfolioUrl,
  updatePortfolioUrl,
  deletePortfolioUrl,
  updatePersonalField,
  updateExperienceField,
  updateRoleField,
  setValuesFromLocalStorage,
  setAsyncEmailState,
} = jobApplicationSlice.actions;

export default jobApplicationSlice.reducer;
