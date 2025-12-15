import { checkEmailUniqueApi } from '../api/mockValidationApi';
import { STEPS } from '../constants/steps';
import type { StepSchema } from '../types/jobApplication.types';

export const personalSchema: StepSchema = {
  stepId: STEPS.PERSONAL,
  label: 'Personal',
  fields: [
    {
      id: 'fullName',
      label: 'Full Name',
      type: 'string',
      rendererType: 'textInput',
      required: true,
    },
    {
      id: 'phone',
      label: 'Phone',
      type: 'number',
      rendererType: 'tel',
      required: true,
    },
    {
      id: 'email',
      label: 'Email',
      type: 'string',
      rendererType: 'emailInput',
      required: true,
      asyncValidate: checkEmailUniqueApi,
    },
    {
      id: 'location',
      label: 'Location',
      type: 'string',
      rendererType: 'textInput',
      required: true,
    },
  ],
};
