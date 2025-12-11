import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { STEPS } from '../constants/steps';

export type StepId = (typeof STEPS)[keyof typeof STEPS];

export interface PersonalData {
  name: string;
  phone: string;
  email: string;
  location: string;
}

export interface ExperienceData {
  yoe?: number;
  mentorshipRequired?: boolean;
  teamLead?: boolean;
  primaryTechStack?: string;
}

export interface RoleData {
  role?: 'frontend' | 'backend' | 'qa';
  reactYoe?: number;
  portfolioUrls: string[];
  nodeYoe?: number;
  automationExperience?: number;
}

export interface JobApplicationValues {
  personal: PersonalData;
  experience: ExperienceData;
  role: RoleData;
}

export interface FieldErrors {
  [fieldName: string]: string | undefined;
}

export interface JobApplicationState {
  currentStep: StepId;
  values: JobApplicationValues;
  errors: {
    personal: FieldErrors;
    experience: FieldErrors;
    role: FieldErrors;
  };
}

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
} = jobApplicationSlice.actions;

export default jobApplicationSlice.reducer;
