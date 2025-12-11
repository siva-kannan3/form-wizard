import type { FieldInputSchema } from '../types/jobApplication.types';

export function isFieldVisible(field: FieldInputSchema, allValues: Record<string, any>): boolean {
  const cond = field.showIf;
  if (!cond) return true;
  const other = allValues[cond.fieldId];

  if (cond.equals !== undefined && other !== cond.equals) return false;
  if (cond.lt !== undefined && !(Number(other) < cond.lt)) return false;
  if (cond.gte !== undefined && !(Number(other) >= cond.gte)) return false;

  return true;
}
