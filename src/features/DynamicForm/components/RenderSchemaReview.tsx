import React from 'react';
import type { FieldInputSchema, StepSchema } from '../types/jobApplication.types';
import { isFieldVisible } from '../utils/visibility';
import { ReviewRow } from './ReviewRow';

function defaultReviewDisplay(value: any, field: FieldInputSchema): React.ReactNode {
  if (value === undefined || value === null || value === '') return '—';

  if (field.type === 'boolean') return value ? 'Yes' : 'No';

  if (Array.isArray(value)) {
    return (
      <ul style={{ margin: 0, paddingLeft: 18 }}>
        {value.map((v, i) => (
          <li key={i} style={{ wordBreak: 'break-all', marginBottom: 4 }}>
            {v || '—'}
          </li>
        ))}
      </ul>
    );
  }

  return String(value);
}

interface Props {
  schema: StepSchema;
  sectionValues: Record<string, any>;
}

export const RenderSchemaReview: React.FC<Props> = ({ schema, sectionValues }) => {
  return (
    <>
      {schema.fields.map((field) => {
        if (!isFieldVisible(field, sectionValues)) return null;

        const raw = sectionValues[field.id];
        const value = field.reviewRender
          ? field.reviewRender(raw, field)
          : defaultReviewDisplay(raw, field);

        return <ReviewRow key={field.id} label={field.label} value={value} />;
      })}
    </>
  );
};
