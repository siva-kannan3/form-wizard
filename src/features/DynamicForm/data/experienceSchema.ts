import { STEPS } from '../constants/steps';
import type { StepSchema } from '../types/jobApplication.types';

export const experienceSchema: StepSchema = {
  stepId: STEPS.EXPERIENCE,
  label: 'Experience',
  fields: [
    {
      id: 'yoe',
      label: 'Years of Experience',
      type: 'number',
      rendererType: 'numberInput',
      required: true,
      gt: 0,
      min: 0,
    },
    {
      id: 'mentorshipRequired',
      label: 'Mentorship Required',
      type: 'boolean',
      rendererType: 'checkbox',
      showIf: { fieldId: 'yoe', lt: 2 },
    },
    {
      id: 'teamLead',
      label: 'Team Lead',
      type: 'boolean',
      rendererType: 'checkbox',
      showIf: { fieldId: 'yoe', gte: 2 },
    },
    {
      id: 'primaryTechStack',
      label: 'Primary Tech Stack',
      type: 'string',
      rendererType: 'textInput',
      required: true,
      showIf: { fieldId: 'yoe', gte: 2 },
    },
  ],
};
