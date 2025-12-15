import { STEP_CONFIG } from '../data/stepConfig';
import { isFieldVisible } from '../utils/visibility';
import type { FieldInputSchema } from '../types/jobApplication.types';
import type { JobApplicationValues, StepId } from '../types/store.types';

export type FieldEntry = {
  step: StepId;
  field: FieldInputSchema;
  value: unknown;
};

export function isValueComplete(value: unknown): boolean {
  if (typeof value === 'boolean') return true;

  if (Array.isArray(value)) {
    return (
      value.length > 0 &&
      value.every((v) => v !== undefined && v !== null && String(v).trim() !== '')
    );
  }

  if (typeof value === 'number') {
    return !Number.isNaN(value);
  }

  return value !== undefined && value !== null && String(value).trim() !== '';
}

export function getVisibleFields(values: JobApplicationValues): FieldEntry[] {
  const result: FieldEntry[] = [];

  for (const stepId of Object.keys(STEP_CONFIG) as StepId[]) {
    const { schema, valuesKey } = STEP_CONFIG[stepId];
    const stepValues = values[valuesKey] as Record<string, unknown>;

    for (const field of schema.fields) {
      if (!isFieldVisible(field, stepValues)) continue;

      result.push({
        step: stepId,
        field,
        value: stepValues[field.id],
      });
    }
  }

  return result;
}

export function countTotalVisibleFields(values: JobApplicationValues): number {
  return getVisibleFields(values).length;
}

export function countCompletedVisibleFields(values: JobApplicationValues): number {
  return getVisibleFields(values).filter((f) => isValueComplete(f.value)).length;
}

export function computeVisibleFieldsProgressPercent(values: JobApplicationValues): number {
  const total = countTotalVisibleFields(values);
  const completed = countCompletedVisibleFields(values);
  return total === 0 ? 100 : Math.round((completed / total) * 100);
}

export function computeProgress(values: JobApplicationValues) {
  const visibleFields = getVisibleFields(values);
  const total = visibleFields.length;
  const completed = visibleFields.filter((f) => isValueComplete(f.value)).length;

  return {
    visibleFields,
    total,
    completed,
    percent: total === 0 ? 100 : Math.round((completed / total) * 100),
  };
}
