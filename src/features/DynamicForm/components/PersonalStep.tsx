import type { FormEvent } from 'react';
import { useJobApplication } from '../hooks/useJobApplication';
import { useStepNavigation } from '../hooks/useStepNavigation';
import { useSelector } from 'react-redux';
import { getCurrentStep } from '../slice/selectors';

export const PersonalStep = () => {
  const { values, errors, setPersonalField } = useJobApplication();
  const { next } = useStepNavigation();
  const currentStep = useSelector(getCurrentStep);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    next(currentStep);
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Personal Info</h2>

      <div>
        <label>
          Name
          <input
            type="text"
            value={values.personal.name}
            onChange={(e) => setPersonalField('name', e.target.value)}
          />
        </label>
        {errors.personal.name && <div style={{ color: 'red' }}>{errors.personal.name}</div>}
      </div>

      <div>
        <label>
          Phone Number
          <input
            type="tel"
            value={values.personal.phone}
            onChange={(e) => setPersonalField('phone', e.target.value)}
          />
        </label>
        {errors.personal.phone && <div style={{ color: 'red' }}>{errors.personal.phone}</div>}
      </div>

      <div>
        <label>
          Email
          <input
            type="email"
            value={values.personal.email}
            onChange={(e) => setPersonalField('email', e.target.value)}
          />
        </label>
        {errors.personal.email && <div style={{ color: 'red' }}>{errors.personal.email}</div>}
      </div>

      <div>
        <label>
          Location
          <input
            type="text"
            value={values.personal.location}
            onChange={(e) => setPersonalField('location', e.target.value)}
          />
        </label>
        {errors.personal.location && <div style={{ color: 'red' }}>{errors.personal.location}</div>}
      </div>

      <button type="submit">Next</button>
    </form>
  );
};
