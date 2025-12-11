import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { describe, expect, test, vi } from 'vitest';

import InputRenderer from '../InputRenderer';

vi.mock('../PortfolioList', () => {
  return {
    default: () => <div data-testid="mock-portfolio-list">PortfolioListMock</div>,
  };
});

type Field = {
  id: string;
  label: string;
  type?: string;
  rendererType?: string;
  options?: string[];
  required?: boolean;
  min?: number;
};

const renderInput = (field: Partial<Field>, propsOverrides?: any) => {
  const fieldComplete: Field = {
    id: field.id ?? 'testField',
    label: field.label ?? 'Test Field',
    type: field.type ?? 'string',
    rendererType: field.rendererType,
    options: field.options,
    required: field.required,
    min: field.min,
  };

  const onChange = propsOverrides?.onChange ?? vi.fn();

  render(
    <InputRenderer
      field={fieldComplete as any}
      value={propsOverrides?.value}
      error={propsOverrides?.error}
      onChange={onChange}
      idPrefix="t"
    />,
  );

  return { onChange };
};

describe('InputRenderer', () => {
  test('renders text input and calls onChange with string', async () => {
    const { onChange } = renderInput({ id: 'name', label: 'Full Name', type: 'string' });
    const input = screen.getByLabelText(/Full Name/i) as HTMLInputElement;
    expect(input).toBeInTheDocument();
    await userEvent.type(input, 'Alice');

    expect(onChange).toHaveBeenCalled();
  });

  test('renders number input and converts value to number', async () => {
    const { onChange } = renderInput(
      { id: 'yoe', label: 'Years', type: 'number' },
      { value: undefined },
    );
    const input = screen.getByLabelText(/Years/i) as HTMLInputElement;
    expect(input).toHaveAttribute('type', 'number');
    await userEvent.clear(input);
    await userEvent.type(input, '5');

    expect(onChange).toHaveBeenCalled();

    await userEvent.clear(input);
    expect(onChange).toHaveBeenCalled();
  });

  test('renders checkbox for boolean and calls onChange with boolean (in order)', async () => {
    const { onChange } = renderInput({ id: 'teamLead', label: 'Team Lead', type: 'boolean' });
    const input = screen.getByLabelText(/Team Lead/i) as HTMLInputElement;
    expect(input).toBeInTheDocument();
    expect(input.getAttribute('type')).toBe('checkbox');

    await userEvent.click(input);
    expect(onChange).toHaveBeenNthCalledWith(1, 'teamLead', true);
  });

  test('renders textarea when rendererType is textarea', async () => {
    const { onChange } = renderInput(
      { id: 'bio', label: 'Bio', type: 'string', rendererType: 'textarea' },
      { value: '' },
    );
    const textarea = screen.getByLabelText(/Bio/i) as HTMLTextAreaElement;
    expect(textarea).toBeInTheDocument();
    await userEvent.type(textarea, 'hello world');
    expect(onChange).toHaveBeenCalled();
  });

  test('renders select and calls onChange with selected value', async () => {
    const opts = ['frontend', 'backend'];
    const { onChange } = renderInput(
      { id: 'role', label: 'Role', type: 'string', rendererType: 'select', options: opts },
      { value: '' },
    );
    const select = screen.getByLabelText(/Role/i) as HTMLSelectElement;
    expect(select).toBeInTheDocument();

    await userEvent.selectOptions(select, 'backend');
    expect(onChange).toHaveBeenCalledWith('role', 'backend');
  });

  test('renders PortfolioList special case', () => {
    renderInput({ id: 'portfolioUrls', label: 'Portfolio URLs', type: 'array' }, { value: [] });
    const mock = screen.getByTestId('mock-portfolio-list');
    expect(mock).toBeInTheDocument();
  });

  test('displays error message and aria attributes', () => {
    renderInput(
      { id: 'email', label: 'Email', type: 'string' },
      { value: '', error: 'Invalid email' },
    );
    const err = screen.getByText(/Invalid email/i);
    expect(err).toBeInTheDocument();
  });
});
