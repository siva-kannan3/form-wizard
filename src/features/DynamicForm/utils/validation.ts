import type { StepSchema } from '../types/jobApplication.types';
import type { FieldErrors, JobApplicationValues, StepId } from '../types/store.types';
import { STEP_ORDER } from './steps';
import { STEPS } from '../constants/steps';
import { STEP_CONFIG } from '../data/stepConfig';
import { isFieldVisible } from './visibility';

const EMAIL_REGEX = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
const TEL_REGEX = /^\d{10}$/;

export function validateStepFromSchema(
  schema: StepSchema,
  values: Record<string, any>,
): FieldErrors {
  const errors: FieldErrors = {};

  for (const field of schema.fields) {
    if (!isFieldVisible(field, values)) continue;

    const val = values[field.id];

    if (field.required) {
      const isEmpty =
        val === undefined || val === null || (typeof val === 'string' && val.trim() === '');

      if (isEmpty) {
        errors[field.id] = `${field.label} is required`;
        continue;
      }
    }

    if (val === undefined || val === null || val === '') continue;

    switch (field.rendererType) {
      case 'numberInput': {
        const num = typeof val === 'number' ? val : Number(val);

        if (Number.isNaN(num)) {
          errors[field.id] = `${field.label} must be a number`;
          continue;
        }

        if (field.min !== undefined && num < field.min) {
          errors[field.id] = `${field.label} must be >= ${field.min}`;
        }

        if (field.gt !== undefined && num <= field.gt) {
          errors[field.id] = `${field.label} must be > ${field.gt}`;
        }

        if (field.max !== undefined && num > field.max) {
          errors[field.id] = `${field.label} must be <= ${field.max}`;
        }

        break;
      }

      case 'textInput': {
        if (typeof val !== 'string') {
          errors[field.id] = `${field.label} must be a string`;
          continue;
        }

        if (field.minLength !== undefined && val.length < field.minLength) {
          errors[field.id] = `${field.label} must be at least ${field.minLength} characters`;
        }

        if (field.maxLength !== undefined && val.length > field.maxLength) {
          errors[field.id] = `${field.label} must be at most ${field.maxLength} characters`;
        }

        break;
      }

      case 'emailInput': {
        if (!EMAIL_REGEX.test(String(val))) {
          errors[field.id] = 'Invalid email address';
        }
        break;
      }

      case 'tel': {
        if (!TEL_REGEX.test(String(val))) {
          errors[field.id] = 'Phone number must be 10 digits';
        }
        break;
      }

      case 'checkbox': {
        if (typeof val !== 'boolean') {
          errors[field.id] = `${field.label} must be true or false`;
        }
        break;
      }
    }

    if (field.options && val && !field.options.includes(val)) {
      errors[field.id] = `${field.label} must be one of: ${field.options.join(', ')}`;
    }

    if (field.rendererType === 'portfolioList') {
      if (!Array.isArray(val)) continue;

      const urlRegex = /^(https?:\/\/)?([\w-]+\.)+[\w-]{2,}(\/\S*)?$/i;

      for (let i = 0; i < val.length; i++) {
        const item = val[i];
        if (typeof item !== 'string' || !urlRegex.test(item.trim())) {
          errors[field.id] = `${field.label} contains an invalid URL at position ${i + 1}`;
          break;
        }
      }
    }
  }

  return errors;
}

export function validateStep(stepId: StepId, values: JobApplicationValues): FieldErrors {
  if (stepId === STEPS.REVIEW) return {};
  const config = STEP_CONFIG[stepId];
  if (!config) return {};

  return validateStepFromSchema(config.schema, values[config.valuesKey] as Record<string, any>);
}

export function getFirstIncompleteStep(allValues: JobApplicationValues): StepId {
  for (const step of STEP_ORDER) {
    const errs = validateStep(step, allValues);
    if (Object.keys(errs).length > 0) return step;
  }

  return STEPS.REVIEW;
}
