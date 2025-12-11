import { STEPS } from '../constants/steps';
import { experienceSchema } from '../data/experienceSchema';
import { rolePreferenceSchema } from '../data/rolesSchema';
import type { StepSchema } from '../types/jobApplication.types';
import type { FieldErrors, JobApplicationValues } from '../types/store.types';
import type { STEP_ORDER } from './steps';

import { isFieldVisible } from './visibility';

export function validateStepFromSchema(
  schema: StepSchema,
  values: Record<string, any>,
): FieldErrors {
  const errors: FieldErrors = {};

  for (const field of schema.fields) {
    if (!isFieldVisible(field, values)) continue;

    const val = values[field.id];

    // required
    if (field.required) {
      const empty =
        val === undefined || val === null || (typeof val === 'string' && val.trim() === '');
      if (empty) {
        errors[field.id] = `${field.label} is required`;
        continue;
      }
    }

    if (field.id === 'portfolioUrls') {
      if (!Array.isArray(val) || val.length === 0) {
        continue;
      }

      const urlRe = /^(https?:\/\/)?([\w-]+\.)+[\w-]{2,}(\/\S*)?$/i;

      let badIndex = -1;
      for (let i = 0; i < val.length; i++) {
        const item = val[i];
        if (typeof item !== 'string' || item.trim() === '') {
          badIndex = i;
          break;
        }
        if (!urlRe.test(item.trim())) {
          badIndex = i;
          break;
        }
      }

      if (badIndex !== -1) {
        errors[field.id] = `${field.label} contains an invalid URL at position ${badIndex + 1}`;
      }

      continue;
    }

    // skip empty optional
    if (val === undefined || val === null || val === '') continue;

    if (field.type === 'number') {
      const num = typeof val === 'number' ? val : Number(val);
      if (Number.isNaN(num)) {
        errors[field.id] = `${field.label} must be a number`;
        continue;
      }
      if (field.min !== undefined && num < field.min) {
        errors[field.id] = `${field.label} must be >= ${field.min}`;
      }
      if (field.gt !== undefined && num < field.gt) {
        errors[field.id] = `${field.label} must be >= ${field.gt}`;
      }
      if (field.max !== undefined && num > field.max) {
        errors[field.id] = `${field.label} must be <= ${field.max}`;
      }
    }

    if (field.type === 'string') {
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
    }

    if (field.options && val && !field.options.includes(val)) {
      errors[field.id] = `${field.label} must be one of: ${field.options.join(', ')}`;
    }
  }

  return errors;
}

export function validatePersonal(values: JobApplicationValues['personal']) {
  const errors: Record<string, string | undefined> = {};
  if (!values.name || !values.name.trim()) errors.name = 'Name is mandatory field';
  if (!values.location || !values.location.trim()) errors.location = 'Location is mandatory field';
  if (!values.phone || !/^\d{10}$/.test(String(values.phone)))
    errors.phone = 'Phone must be 10 digits';
  if (!values.email || !/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(values.email))
    errors.email = 'Invalid email';
  return errors;
}

export function getFirstIncompleteStep(
  allValues: JobApplicationValues,
): (typeof STEP_ORDER)[number] {
  // personal
  const personalErr = validatePersonal(allValues.personal);
  if (Object.keys(personalErr).length > 0) return STEPS.PERSONAL;

  // experience
  const expVals = allValues.experience as Record<string, any>;
  const expErr = validateStepFromSchema(experienceSchema, expVals);
  if (Object.keys(expErr).length > 0) return STEPS.EXPERIENCE;

  // role
  const roleVals = allValues.role as Record<string, any>;
  const roleErr = validateStepFromSchema(rolePreferenceSchema, roleVals);
  if (Object.keys(roleErr).length > 0) return STEPS.ROLE;

  return STEPS.REVIEW;
}
