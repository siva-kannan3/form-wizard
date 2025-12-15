import { STEPS } from '../constants/steps';
import type { StepSchema } from '../types/jobApplication.types';
import type { StepId } from '../types/store.types';
import { experienceSchema } from './experienceSchema';
import { personalSchema } from './personalSchema';
import { rolePreferenceSchema } from './rolesSchema.tsx';

type StepConfigType = {
  [val in Exclude<StepId, 'review'>]: {
    schema: StepSchema;
    valuesKey: val;
  };
};

export const STEP_CONFIG: StepConfigType = {
  [STEPS.PERSONAL]: {
    schema: personalSchema,
    valuesKey: STEPS.PERSONAL,
  },
  [STEPS.EXPERIENCE]: {
    schema: experienceSchema,
    valuesKey: STEPS.EXPERIENCE,
  },
  [STEPS.ROLE]: {
    schema: rolePreferenceSchema,
    valuesKey: STEPS.ROLE,
  },
};
