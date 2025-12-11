import type { STEPS } from '../constants/steps';

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

export type AsyncStatus = 'idle' | 'loading' | 'succeeded' | 'failed';

export interface JobApplicationState {
  currentStep: StepId;
  values: JobApplicationValues;
  errors: {
    personal: FieldErrors;
    experience: FieldErrors;
    role: FieldErrors;
  };
  asyncValidations: {
    email: {
      status: AsyncStatus;
      error: string | null;
    };
  };
}
