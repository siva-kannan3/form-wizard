import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getCurrentStep } from '../slice/selectors';
import { useJobApplication } from '../hooks/useJobApplication';
import { useStepNavigation } from '../hooks/useStepNavigation';
import { STEP_CONFIG } from '../data/stepConfig';
import { STEPS } from '../constants/steps';
import { RenderSchemaReview } from './RenderSchemaReview';
import { resetApplication } from '../slice/jobApplicationSlice';
import { clearPersistedJobApplication } from '../utils/persistence';

const ReviewStep: React.FC = () => {
  const dispatch = useDispatch();
  const { values } = useJobApplication();
  const { back, goTo } = useStepNavigation();
  const currentStep = useSelector(getCurrentStep);

  const handleSubmit = () => {
    console.log('Submitting application:', values);
    dispatch(resetApplication());
    clearPersistedJobApplication();
    goTo(STEPS.PERSONAL);
  };

  return (
    <div className="reviewStepWrapper">
      <h2 className="formTitle">Review & Submit</h2>

      {Object.entries(STEP_CONFIG).map(([stepId, cfg]) => (
        <section key={stepId} className="reviewStep">
          <div className="titleWrapper">
            <h3>{cfg.schema.label}</h3>
            <button type="button" onClick={() => goTo(stepId as any)}>
              Edit
            </button>
          </div>

          <div className="content">
            <RenderSchemaReview schema={cfg.schema} sectionValues={values[cfg.valuesKey]} />
          </div>
        </section>
      ))}

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
