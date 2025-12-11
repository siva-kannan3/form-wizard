import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getCurrentStep } from '../slice/selectors';
import { useJobApplication } from '../hooks/useJobApplication';
import { getFirstIncompleteStep } from '../utils/validation';
import { resetApplication } from '../slice/jobApplicationSlice';
import { useStepNavigation } from '../hooks/useStepNavigation';
import { STEPS } from '../constants/steps';
import { experienceSchema } from '../data/experienceSchema';
import { rolePreferenceSchema } from '../data/rolesSchema';
import RenderSchemaReview from './RenderSchemaReview';
import { ReviewRow } from './ReviewRow';

const portfolioRenderer = (value: any) => {
  if (!Array.isArray(value) || value.length === 0) return '—';
  return (
    <ul style={{ margin: 0, paddingLeft: 18 }}>
      {value.map((u: string, i: number) => (
        <li key={i} style={{ wordBreak: 'break-all', marginBottom: 6 }}>
          {u || '—'}
        </li>
      ))}
    </ul>
  );
};

export const ReviewStep: React.FC = () => {
  const dispatch = useDispatch();
  const { values } = useJobApplication();
  const { back, goTo } = useStepNavigation();
  const currentStep = useSelector(getCurrentStep);

  const handleEdit = (stepId: 'personal' | 'experience' | 'role') => {
    goTo(stepId);
  };

  const handleSubmit = () => {
    const firstIncomplete = getFirstIncompleteStep(values);
    if (firstIncomplete !== 'review') {
      goTo(firstIncomplete);
      return;
    }

    console.log('Submitting application:', values);

    dispatch(resetApplication());
    try {
      localStorage.removeItem('job-app-state-v1');
    } catch (e) {
      console.log('Local storage deletion failed', e);
    }

    goTo(STEPS.PERSONAL);
  };

  return (
    <div style={{ maxWidth: 980, margin: '0 auto', padding: 16 }}>
      <h1 style={{ marginBottom: 12 }}>Review & Submit</h1>

      <section style={{ marginBottom: 18 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ margin: 0 }}>Personal</h2>
          <button type="button" onClick={() => handleEdit('personal')} style={{ fontSize: 13 }}>
            Edit
          </button>
        </div>

        <div style={{ background: '#fafafa', padding: 12, borderRadius: 6, marginTop: 8 }}>
          <ReviewRow label="Full Name" value={values.personal.name || '—'} />
          <ReviewRow label="Phone Number" value={values.personal.phone || '—'} />
          <ReviewRow label="Email" value={values.personal.email || '—'} />
          <ReviewRow label="Location" value={values.personal.location || '—'} />
        </div>
      </section>

      <section style={{ marginBottom: 18 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ margin: 0 }}>Experience</h2>
          <button type="button" onClick={() => handleEdit('experience')} style={{ fontSize: 13 }}>
            Edit
          </button>
        </div>

        <div style={{ background: '#fafafa', padding: 12, borderRadius: 6, marginTop: 8 }}>
          <RenderSchemaReview schema={experienceSchema} sectionValues={values.experience} />
        </div>
      </section>

      <section style={{ marginBottom: 18 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ margin: 0 }}>Role Preference</h2>
          <button type="button" onClick={() => handleEdit('role')} style={{ fontSize: 13 }}>
            Edit
          </button>
        </div>

        <div style={{ background: '#fafafa', padding: 12, borderRadius: 6, marginTop: 8 }}>
          <RenderSchemaReview
            schema={rolePreferenceSchema}
            sectionValues={values.role}
            customRenderer={{ portfolioUrls: portfolioRenderer }}
          />
        </div>
      </section>

      <div style={{ marginTop: 20 }}>
        <button type="button" onClick={() => back(currentStep)} style={{ marginRight: 8 }}>
          Back
        </button>

        <button type="button" onClick={handleSubmit}>
          Submit Application
        </button>
      </div>
    </div>
  );
};

export default ReviewStep;
