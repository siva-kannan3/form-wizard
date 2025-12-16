import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, test, vi } from 'vitest';
import '@testing-library/jest-dom';

import InputRenderer from '../InputRenderer';
import { STEPS } from '../../constants/steps';
import type { FieldInputSchema } from '../../types/jobApplication.types';

vi.mock('react-redux', async () => {
  const actual = await vi.importActual('react-redux');
  return {
    ...actual,
    useDispatch: () => vi.fn(),
    useSelector: (selector: any) =>
      selector({
        jobApplication: {
          asyncValidations: {
            personal: {
              email: { status: 'idle', error: null },
            },
          },
        },
      }),
  };
});

vi.mock('../PortfolioList', () => ({
  default: () => <div data-testid="mock-portfolio-list">PortfolioListMock</div>,
}));

const renderInput = (fieldOverrides: Partial<any>, propsOverrides?: any) => {
  const onChange = propsOverrides?.onChange ?? vi.fn();

  const field: FieldInputSchema = {
    id: 'testField',
    label: 'Test Field',
    type: 'string',
    rendererType: 'textInput',
    ...fieldOverrides,
  };

  render(
    <InputRenderer
      currentStep={STEPS.PERSONAL}
      field={field}
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
    const { onChange } = renderInput({
      id: 'name',
      label: 'Full Name',
      rendererType: 'textInput',
    });

    const input = screen.getByLabelText(/Full Name/i);
    await userEvent.type(input, 'Alice');

    expect(onChange).toHaveBeenCalled();
  });

  test('renders number input and converts value to number', async () => {
    const { onChange } = renderInput({
      id: 'yoe',
      label: 'Years',
      type: 'number',
      rendererType: 'numberInput',
    });

    const input = screen.getByLabelText(/Years/i);
    expect(input).toHaveAttribute('type', 'number');

    await userEvent.clear(input);
    await userEvent.type(input, '5');

    expect(onChange).toHaveBeenLastCalledWith('yoe', 5);
  });

  test('renders checkbox and calls onChange with boolean', async () => {
    const { onChange } = renderInput({
      id: 'teamLead',
      label: 'Team Lead',
      type: 'boolean',
      rendererType: 'checkbox',
    });

    const checkbox = screen.getByLabelText(/Team Lead/i);
    expect(checkbox).toHaveAttribute('type', 'checkbox');

    await userEvent.click(checkbox);
    expect(onChange).toHaveBeenCalledWith('teamLead', true);
  });

  test('renders textarea', async () => {
    const { onChange } = renderInput({
      id: 'bio',
      label: 'Bio',
      rendererType: 'textarea',
    });

    const textarea = screen.getByLabelText(/Bio/i);
    await userEvent.type(textarea, 'hello');

    expect(onChange).toHaveBeenCalled();
  });

  test('renders select and updates value', async () => {
    const { onChange } = renderInput({
      id: 'role',
      label: 'Role',
      rendererType: 'select',
      options: ['frontend', 'backend'],
    });

    const select = screen.getByLabelText(/Role/i);
    await userEvent.selectOptions(select, 'backend');

    expect(onChange).toHaveBeenCalledWith('role', 'backend');
  });

  test('renders PortfolioList for portfolioList renderer', () => {
    renderInput({
      id: 'portfolioUrls',
      label: 'Portfolio',
      rendererType: 'portfolioList',
    });

    expect(screen.getByTestId('mock-portfolio-list')).toBeInTheDocument();
  });

  test('renders error message', () => {
    renderInput(
      {
        id: 'email',
        label: 'Email',
        rendererType: 'emailInput',
      },
      { error: 'Invalid email' },
    );

    expect(screen.getByText(/Invalid email/i)).toBeInTheDocument();
  });
});
