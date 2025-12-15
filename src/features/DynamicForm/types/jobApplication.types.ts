import type { StepId } from './store.types';

export type FieldInputType = 'string' | 'boolean' | 'number';

export type FieldRendererType =
  | 'select'
  | 'textInput'
  | 'textarea'
  | 'checkbox'
  | 'numberInput'
  | 'tel'
  | 'emailInput'
  | 'portfolioList'; // custom component rendering for portfolio urls

export type AsyncValidationResult = { ok: true } | { ok: false; reason: string };

export type ReviewRenderer = (value: any, field: FieldInputSchema) => React.ReactNode;

export type AsyncValidatorFn = (
  value: unknown,
  signal?: AbortSignal,
) => Promise<AsyncValidationResult>;

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
  asyncValidate?: AsyncValidatorFn;
  showIf?: {
    fieldId: string;
    lt?: number;
    gte?: number;
    equals?: string;
  };
  reviewRender?: ReviewRenderer;
};

export type StepSchema = {
  stepId: Exclude<StepId, 'review'>;
  label: string;
  fields: FieldInputSchema[];
};
