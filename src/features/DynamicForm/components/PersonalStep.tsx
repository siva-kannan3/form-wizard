import type { FocusEvent, FormEvent } from 'react';
import { useJobApplication } from '../hooks/useJobApplication';
import { useStepNavigation } from '../hooks/useStepNavigation';
import { useSelector } from 'react-redux';
import { getAsyncEmailState, getCurrentStep } from '../slice/selectors';
import { useEmailUniqueness } from '../hooks/useEmailUniqueness';

export const PersonalStep = () => {
  const currentStep = useSelector(getCurrentStep);

  const { next } = useStepNavigation();
  const { values, errors, setPersonalField } = useJobApplication();
  const { handleEmailBlur } = useEmailUniqueness();
  const asyncEmail = useSelector(getAsyncEmailState);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    next(currentStep);
  };

  const handleEmailBlurEvent = (e: FocusEvent<HTMLInputElement>) => {
    const email = e.target.value;

    handleEmailBlur(email);
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2 className="formTitle">Personal Info</h2>

      <div className="formField">
        <label htmlFor="name">Name</label>
        <input
          id="name"
          type="text"
          value={values.personal.name}
          onChange={(e) => setPersonalField('name', e.target.value)}
        />
        {errors.personal.name && <div style={{ color: 'red' }}>{errors.personal.name}</div>}
      </div>

      <div className="formField">
        <label htmlFor="phone">Phone Number</label>
        <input
          id="phone"
          type="tel"
          value={values.personal.phone}
          onChange={(e) => setPersonalField('phone', e.target.value)}
        />
        {errors.personal.phone && <div style={{ color: 'red' }}>{errors.personal.phone}</div>}
      </div>

      <div className="formField">
        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          value={values.personal.email}
          onChange={(e) => setPersonalField('email', e.target.value)}
          onBlur={handleEmailBlurEvent}
        />
        {asyncEmail.status === 'loading' && <div style={{ fontSize: 12 }}>Checking email…</div>}
        {asyncEmail.error && <div style={{ color: 'red' }}>{asyncEmail.error}</div>}
        {errors.personal.email && <div style={{ color: 'red' }}>{errors.personal.email}</div>}
      </div>

      <div className="formField">
        <label htmlFor="location">Location</label>
        <input
          id="location"
          type="text"
          value={values.personal.location}
          onChange={(e) => setPersonalField('location', e.target.value)}
        />
        {errors.personal.location && <div style={{ color: 'red' }}>{errors.personal.location}</div>}
      </div>

      <div className="formFooter">
        <button type="submit">Next</button>
      </div>
    </form>
  );
};
