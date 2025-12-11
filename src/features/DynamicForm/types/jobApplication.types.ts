import type { STEPS } from '../constants/steps';

export type FieldInputType = 'string' | 'boolean' | 'number';

export type FieldRendererType = 'select' | 'textInput' | 'textarea' | 'checkbox' | 'numberInput';

export type FieldInputSchema = {
  id: string;
  label: string;
  type: FieldInputType;
  required?: boolean;
  rendererType?: FieldRendererType;
  options?: string[]; // for dropdown menu
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
  gt?: number;
  showIf?: {
    fieldId: string;
    lt?: number;
    gte?: number;
    equals?: string;
  };
};

export type StepSchema = {
  stepId: typeof STEPS.EXPERIENCE | typeof STEPS.ROLE;
  label: string;
  fields: FieldInputSchema[];
};
