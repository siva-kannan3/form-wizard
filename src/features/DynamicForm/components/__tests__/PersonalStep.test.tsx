import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, beforeEach, vi, type Mock } from 'vitest';

import { useJobApplication } from '../../hooks/useJobApplication';
import { useStepNavigation } from '../../hooks/useStepNavigation';
import { useSelector } from 'react-redux';
import { PersonalStep } from '../../components/PersonalStep'; // adjust path if needed
import { useEmailUniqueness } from '../../hooks/useEmailUniqueness';
import { getAsyncEmailState, getCurrentStep } from '../../slice/selectors';

vi.mock('../../hooks/useJobApplication', () => ({
  useJobApplication: vi.fn(),
}));

vi.mock('../../hooks/useStepNavigation', () => ({
  useStepNavigation: vi.fn(),
}));

vi.mock('../../hooks/useEmailUniqueness', () => ({
  useEmailUniqueness: vi.fn(),
}));

vi.mock('react-redux', () => ({
  useSelector: vi.fn(),
}));

const mockedUseJobApplication = useJobApplication as unknown as Mock;
const mockedUseStepNavigation = useStepNavigation as unknown as Mock;
const mockedUseSelector = useSelector as unknown as Mock;
const mockedUseEmailUniqueness = useEmailUniqueness as unknown as Mock;

describe('PersonalStep', () => {
  const baseValues = {
    personal: {
      name: 'Test user',
      phone: '1234567890',
      email: 'abc@gmail.co',
      location: 'city',
    },
  };

  beforeEach(() => {
    vi.resetAllMocks();

    mockedUseJobApplication.mockReturnValue({
      values: baseValues,
      errors: { personal: { name: '', phone: '', email: '', location: '' } },
      setPersonalField: vi.fn(),
    });

    mockedUseStepNavigation.mockReturnValue({
      next: vi.fn(),
    });

    mockedUseEmailUniqueness.mockReturnValue({
      handleEmailBlur: vi.fn(),
    });

    mockedUseSelector.mockImplementation((selector) => {
      if (selector === getCurrentStep) return 'personal';
      if (selector === getAsyncEmailState) return { status: 'idle', error: null };

      return undefined;
    });
  });

  it('renders all personal fields with provided values', () => {
    render(<PersonalStep />);

    const nameInput = screen.getByLabelText(/name/i) as HTMLInputElement;
    const phoneInput = screen.getByLabelText(/phone number/i) as HTMLInputElement;
    const emailInput = screen.getByLabelText(/email/i) as HTMLInputElement;
    const locationInput = screen.getByLabelText(/location/i) as HTMLInputElement;

    expect(nameInput).toBeInTheDocument();
    expect(phoneInput).toBeInTheDocument();
    expect(emailInput).toBeInTheDocument();
    expect(locationInput).toBeInTheDocument();

    expect(nameInput.value).toBe(baseValues.personal.name);
    expect(phoneInput.value).toBe(baseValues.personal.phone);
    expect(emailInput.value).toBe(baseValues.personal.email);
    expect(locationInput.value).toBe(baseValues.personal.location);
  });

  it('calls setPersonalField when inputs change', () => {
    const setPersonalField = vi.fn();
    mockedUseJobApplication.mockReturnValue({
      values: baseValues,
      errors: { personal: { name: '', phone: '', email: '', location: '' } },
      setPersonalField,
    });

    render(<PersonalStep />);

    const nameInput = screen.getByLabelText(/name/i) as HTMLInputElement;

    fireEvent.change(nameInput, { target: { value: 'New Name' } });

    expect(setPersonalField).toHaveBeenCalled();

    const [key, val] = setPersonalField.mock.calls[setPersonalField.mock.calls.length - 1];
    expect(key).toBe('name');
    expect(val).toBe('New Name');
  });

  it('shows validation errors when present', () => {
    const errors = {
      personal: {
        name: 'Name required',
        phone: '',
        email: 'Invalid email',
        location: '',
      },
    };

    mockedUseJobApplication.mockReturnValue({
      values: baseValues,
      errors,
      setPersonalField: vi.fn(),
    });

    render(<PersonalStep />);

    expect(screen.getByText(/name required/i)).toBeInTheDocument();
    expect(screen.getByText(/invalid email/i)).toBeInTheDocument();
  });

  it('calls next(currentStep) on submit', async () => {
    const user = userEvent.setup();

    const next = vi.fn();
    mockedUseStepNavigation.mockReturnValue({ next });
    mockedUseSelector.mockImplementation(() => 'personal');

    render(<PersonalStep />);

    const nextButton = screen.getByRole('button', { name: /next/i });
    await user.click(nextButton);

    expect(next).toHaveBeenCalledTimes(1);
    expect(next).toHaveBeenCalledWith('personal');
  });
});
