import React from 'react';
import type { FieldInputSchema } from '../types/jobApplication.types';
import PortfolioList from './PortfolioList';

export type InputValue = string | number | boolean | undefined;

interface InputRendererProps {
  field: FieldInputSchema;
  value: InputValue;
  error?: string | undefined;
  onChange: (name: string, value: InputValue) => void;
  onBlur?: (name: string) => void;
  idPrefix?: string;
}

export const InputRenderer: React.FC<InputRendererProps> = ({
  field,
  value,
  error,
  onChange,
  onBlur,
  idPrefix = 'field',
}) => {
  const id = `${idPrefix}-${field.id}`;

  if (field.id === 'portfolioUrls') {
    return (
      <div className="formField">
        <label style={{ display: 'block', marginBottom: 6 }}>{field.label}</label>

        <PortfolioList />

        {error && (
          <div role="alert" style={{ color: 'red', marginTop: 6 }}>
            {error}
          </div>
        )}
      </div>
    );
  }

  const sharedProps = {
    id,
    name: field.id,
    onBlur: () => onBlur && onBlur(field.id),
  } as const;

  let inputNode: React.ReactNode = null;

  if (field.options && field.rendererType === 'select') {
    inputNode = (
      <select
        {...sharedProps}
        value={value === undefined || value === null ? '' : String(value)}
        onChange={(e) => onChange(field.id, e.target.value || undefined)}
      >
        <option value="">Select...</option>
        {field.options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    );
  } else if (field.type === 'boolean') {
    inputNode = (
      <input
        {...sharedProps}
        type="checkbox"
        checked={Boolean(value)}
        onChange={(e) => onChange(field.id, e.target.checked)}
      />
    );
  } else if (field.rendererType === 'textarea') {
    inputNode = (
      <textarea
        {...sharedProps}
        value={value === undefined || value === null ? '' : String(value)}
        onChange={(e) => onChange(field.id, e.target.value)}
        placeholder={field.label}
      />
    );
  } else {
    const inputType = field.type === 'number' ? 'number' : 'text';
    inputNode = (
      <input
        {...sharedProps}
        type={inputType}
        value={value === undefined || value === null ? '' : String(value)}
        onChange={(e) => {
          const raw = e.target.value;
          if (field.type === 'number') {
            onChange(field.id, raw === '' ? undefined : Number(raw));
          } else {
            onChange(field.id, raw);
          }
        }}
        placeholder={field.label}
        min={field.min ? field.min : undefined}
      />
    );
  }

  return (
    <div className="formField">
      <label htmlFor={id} style={{ display: 'block', marginBottom: 6 }}>
        {field.label}
        {field.required && <span aria-hidden="true"> *</span>}
      </label>

      <div>{inputNode}</div>

      {error && (
        <div id={`${id}-err`} style={{ color: 'red', marginTop: 6 }}>
          {error}
        </div>
      )}
    </div>
  );
};

export default InputRenderer;
