import React, { type FormEvent } from 'react';
import { InputRenderer } from './InputRenderer';
import type { StepSchema } from '../types/jobApplication.types';
import type { FieldErrors } from '../slice/jobApplicationSlice';
import { isFieldVisible } from '../utils/visibility';

export type StepValues = Record<string, any>;

interface DynamicStepRendererProps {
  schema: StepSchema;
  values: StepValues;
  errors: FieldErrors;
  onChange: (field: string, value: any) => void;
  onNext: () => void;
  onBack?: () => void;
  onBlur?: (fieldName: string) => void;
}

export const DynamicStepRenderer: React.FC<DynamicStepRendererProps> = ({
  schema,
  values,
  errors,
  onChange,
  onNext,
  onBack,
  onBlur,
}) => {
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onNext();
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>{schema.label}</h2>

      {schema.fields.map((field) => {
        if (!isFieldVisible(field, values)) return null;

        return (
          <InputRenderer
            key={field.id}
            field={field}
            value={values[field.id]}
            error={errors[field.id]}
            onChange={(name, val) => onChange(name, val)}
            onBlur={(name) => onBlur && onBlur(name)}
          />
        );
      })}

      <div style={{ marginTop: 16 }}>
        {onBack && (
          <button type="button" onClick={onBack} style={{ marginRight: 8 }}>
            Back
          </button>
        )}
        <button type="submit">Next</button>
      </div>
    </form>
  );
};

export default DynamicStepRenderer;
