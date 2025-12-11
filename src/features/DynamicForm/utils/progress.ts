import { isFieldVisible } from '../utils/visibility';
import type { FieldInputSchema } from '../types/jobApplication.types';
import { experienceSchema } from '../data/experienceSchema';
import { rolePreferenceSchema } from '../data/rolesSchema';

type FieldEntry = { section: string; field: any; value: any };

const PERSONAL_FIELDS = [
  { name: 'name', label: 'Full Name', section: 'personal' },
  { name: 'phone', label: 'Phone Number', section: 'personal' },
  { name: 'email', label: 'Email', section: 'personal' },
  { name: 'location', label: 'Location', section: 'personal' },
];

const SCHEMA_MAP: Array<{ schemaName: string; schema: { fields: FieldInputSchema[] } }> = [
  { schemaName: 'experience', schema: experienceSchema },
  { schemaName: 'role', schema: rolePreferenceSchema },
];

export function isValueComplete(val: any, field?: FieldInputSchema | { name?: string }): boolean {
  if (typeof val === 'boolean') return true;

  if (Array.isArray(val)) {
    return (
      val.length > 0 &&
      val.every((it) => it !== undefined && it !== null && String(it).trim() !== '')
    );
  }

  if (typeof val === 'number') {
    return !Number.isNaN(val);
  }

  return val !== undefined && val !== null && String(val).trim() !== '';
}

export function getVisibleFields(values: Record<string, any>): FieldEntry[] {
  const list: FieldEntry[] = [];

  for (const pf of PERSONAL_FIELDS) {
    const sectionValues = (values as any).personal ?? {};
    const value = sectionValues[pf.name];
    list.push({ section: pf.section, field: pf, value });
  }

  for (const mapEntry of SCHEMA_MAP) {
    const sectionName = mapEntry.schemaName;
    const schema = mapEntry.schema;
    const sectionValues = (values as any)[sectionName] ?? {};
    for (const field of schema.fields) {
      if (!isFieldVisible(field, sectionValues)) continue;
      const value = sectionValues[(field as any).name ?? (field as any).id];
      list.push({ section: String(sectionName), field, value });
    }
  }

  return list;
}

export function countTotalVisibleFields(values: Record<string, any>): number {
  return getVisibleFields(values).length;
}

export function countCompletedVisibleFields(values: Record<string, any>): number {
  const fields = getVisibleFields(values);
  return fields.reduce((acc, f) => (isValueComplete(f.value, f.field) ? acc + 1 : acc), 0);
}

export function computeVisibleFieldsProgressPercent(values: Record<string, any>): number {
  const total = countTotalVisibleFields(values);
  const completed = countCompletedVisibleFields(values);
  if (total === 0) return 100;
  return Math.round((completed / total) * 100);
}

export function computeProgress(values: Record<string, any>) {
  const visibleFields = getVisibleFields(values);
  const total = visibleFields.length;
  const completed = visibleFields.reduce(
    (acc, f) => (isValueComplete(f.value, f.field) ? acc + 1 : acc),
    0,
  );
  const percent = total === 0 ? 100 : Math.round((completed / total) * 100);
  return { visibleFields, total, completed, percent };
}
