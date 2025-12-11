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
        />
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
