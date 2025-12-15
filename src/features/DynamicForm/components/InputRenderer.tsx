import React from 'react';
import type { FieldInputSchema } from '../types/jobApplication.types';
import type { StepId } from '../types/store.types';
import PortfolioList from './PortfolioList';
import { runAsyncFieldValidation } from '../slice/thunks';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch } from '../../../store';
import { getAsyncFieldState } from '../slice/selectors';

export type InputValue = string | number | boolean | undefined;

interface InputRendererProps {
  currentStep: StepId;
  field: FieldInputSchema;
  value: InputValue;
  error?: string;
  onChange: (name: string, value: InputValue) => void;
  idPrefix?: string;
}

const HTML_INPUT_MAP: Record<string, string> = {
  textInput: 'text',
  emailInput: 'email',
  tel: 'tel',
  numberInput: 'number',
};

export const InputRenderer: React.FC<InputRendererProps> = ({
  currentStep,
  field,
  value,
  error,
  onChange,
  idPrefix = 'field',
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const { status: asyncStatus, error: asyncError } = useSelector(
    getAsyncFieldState(currentStep, field.id),
  );

  const id = `${idPrefix}-${field.id}`;

  const handleBlur = () => {
    if (!field.asyncValidate) return;

    dispatch(
      runAsyncFieldValidation({
        step: currentStep,
        fieldId: field.id,
        value,
        validator: field.asyncValidate,
      }),
    );
  };

  let inputNode: React.ReactNode = null;

  switch (field.rendererType) {
    case 'portfolioList':
      inputNode = <PortfolioList stepId={currentStep} fieldId={field.id} />;
      break;

    case 'select':
      inputNode = (
        <select
          id={id}
          name={field.id}
          value={value ?? ''}
          onChange={(e) => onChange(field.id, e.target.value || undefined)}
          onBlur={handleBlur}
        >
          <option value="">Select...</option>
          {field.options?.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      );
      break;

    case 'checkbox':
      inputNode = (
        <input
          id={id}
          name={field.id}
          type="checkbox"
          checked={Boolean(value)}
          onChange={(e) => onChange(field.id, e.target.checked)}
          onBlur={handleBlur}
        />
      );
      break;

    case 'textarea':
      inputNode = (
        <textarea
          id={id}
          name={field.id}
          value={value ?? ''}
          onChange={(e) => onChange(field.id, e.target.value)}
          onBlur={handleBlur}
          placeholder={field.label}
        />
      );
      break;

    default: {
      const inputType =
        HTML_INPUT_MAP[field.rendererType] ?? (field.type === 'number' ? 'number' : 'text');

      inputNode = (
        <input
          id={id}
          name={field.id}
          type={inputType}
          value={value ?? ''}
          onChange={(e) => {
            const raw = e.target.value;
            if (field.type === 'number') {
              onChange(field.id, raw === '' ? undefined : Number(raw));
            } else {
              onChange(field.id, raw);
            }
          }}
          onBlur={handleBlur}
          min={field.min}
          placeholder={field.label}
        />
      );
    }
  }

  return (
    <div className="formField">
      <label htmlFor={id}>
        {field.label}
        {field.required && <span aria-hidden="true"> *</span>}
      </label>

      {inputNode}

      {asyncStatus === 'loading' && (
        <div style={{ fontSize: 12, color: '#666', marginTop: 4 }}>Validating…</div>
      )}

      {asyncError && <div style={{ color: 'red', marginTop: 4 }}>{asyncError}</div>}
      {error && (
        <div id={`${id}-err`} style={{ color: 'red', marginTop: 6 }}>
          {error}
        </div>
      )}
    </div>
  );
};

export default InputRenderer;
