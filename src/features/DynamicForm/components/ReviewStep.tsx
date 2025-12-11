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
import { clearPersistedJobApplication } from '../utils/persistence';

const portfolioRenderer = (value: string[]) => {
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

  const handleEdit = (
    stepId: typeof STEPS.PERSONAL | typeof STEPS.EXPERIENCE | typeof STEPS.ROLE,
  ) => {
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
    clearPersistedJobApplication();
    goTo(STEPS.PERSONAL);
  };

  return (
    <div className="reviewStepWrapper">
      <h2 className="formTitle">Review & Submit</h2>

      <div className="reviewSteps">
        <section className="reviewStep">
          <div className="titleWrapper">
            <h3>Personal</h3>
            <button type="button" onClick={() => handleEdit('personal')}>
              Edit
            </button>
          </div>

          <div className="content">
            <ReviewRow label="Full Name" value={values.personal.name || '—'} />
            <ReviewRow label="Phone Number" value={values.personal.phone || '—'} />
            <ReviewRow label="Email" value={values.personal.email || '—'} />
            <ReviewRow label="Location" value={values.personal.location || '—'} />
          </div>
        </section>

        <section className="reviewStep">
          <div className="titleWrapper">
            <h2>Experience</h2>
            <button type="button" onClick={() => handleEdit('experience')}>
              Edit
            </button>
          </div>

          <div className="content">
            <RenderSchemaReview schema={experienceSchema} sectionValues={values.experience} />
          </div>
        </section>

        <section className="reviewStep">
          <div className="titleWrapper">
            <h2>Role Preference</h2>
            <button type="button" onClick={() => handleEdit('role')}>
              Edit
            </button>
          </div>

          <div className="content">
            <RenderSchemaReview
              schema={rolePreferenceSchema}
              sectionValues={values.role}
              customRenderer={{ portfolioUrls: portfolioRenderer }}
            />
          </div>
        </section>
      </div>

      <div className="formFooter">
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
