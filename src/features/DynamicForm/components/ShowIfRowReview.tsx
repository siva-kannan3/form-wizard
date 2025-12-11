import React from 'react';
import { ReviewRow } from './ReviewRow'; // your Row component (label + value)
import type { FieldInputSchema } from '../types/jobApplication.types';
import { isFieldVisible } from '../utils/visibility';

interface ShowIfRowProps {
  field: FieldInputSchema;
  sectionValues: Record<string, any>;
  label?: string;
  renderValue?: (value: any, field: FieldInputSchema) => React.ReactNode;
}

export const ShowIfRow: React.FC<ShowIfRowProps> = ({
  field,
  sectionValues,
  label,
  renderValue,
}) => {
  if (!isFieldVisible(field, sectionValues)) return null;

  const raw = sectionValues[field.id];
  const value = renderValue ? renderValue(raw, field) : defaultDisplay(raw, field);

  return <ReviewRow label={label ?? field.label} value={value ?? '—'} />;
};

function defaultDisplay(raw: any, field: FieldInputSchema): React.ReactNode {
  if (raw === undefined || raw === null || raw === '') return '—';

  if (field.type === 'boolean') return raw ? 'Yes' : 'No';
  if (Array.isArray(raw)) {
    return (
      <ul style={{ margin: 0, paddingLeft: 18 }}>
        {raw.map((it, i) => (
          <li key={i} style={{ wordBreak: 'break-all', marginBottom: 4 }}>
            {it ?? '—'}
          </li>
        ))}
      </ul>
    );
  }
  return String(raw);
}

export default ShowIfRow;
