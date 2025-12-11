import { STEPS } from '../constants/steps';
import type { StepSchema } from '../types/jobApplication.types';

export const rolePreferenceSchema: StepSchema = {
  stepId: STEPS.ROLE,
  label: 'Role Preferences',
  fields: [
    {
      id: 'role',
      label: 'Role',
      type: 'string',
      rendererType: 'select',
      options: ['frontend', 'backend', 'qa'],
      required: true,
    },
    {
      id: 'reactYoe',
      label: 'React Experience (years)',
      type: 'number',
      rendererType: 'textInput',
      min: 0,
      showIf: { fieldId: 'role', equals: 'frontend' },
    },
    {
      id: 'portfolioUrls',
      label: 'Portfolio URLs',
      type: 'string',
      showIf: { fieldId: 'role', equals: 'frontend' },
    },
    {
      id: 'nodeYoe',
      label: 'Node Experience (years)',
      type: 'number',
      rendererType: 'numberInput',
      min: 0,
      showIf: { fieldId: 'role', equals: 'backend' },
    },
    {
      id: 'automationExperience',
      label: 'Automation Experience (years)',
      type: 'number',
      rendererType: 'numberInput',
      min: 0,
      showIf: { fieldId: 'role', equals: 'qa' },
    },
  ],
};
