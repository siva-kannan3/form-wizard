import { useDispatch, useSelector } from 'react-redux';
import { getCurrentStep, getStepErrors, getStepValues } from '../slice/selectors';
import DynamicStepRenderer from './DynamicStepRenderer';
import { useJobApplication } from '../hooks/useJobApplication';
import { useStepNavigation } from '../hooks/useStepNavigation';
import ProgressBar from './ProgressBar';
import { computeVisibleFieldsProgressPercent } from '../utils/progress';
import { STEP_CONFIG } from '../data/stepConfig';
import ReviewStep from './ReviewStep';
import { STEPS } from '../constants/steps';
import { setFieldValue } from '../slice/jobApplicationSlice';
import { STEP_ORDER } from '../utils/steps';

export const ApplicationFormWizard = () => {
  const dispatch = useDispatch();
  const currentStep = useSelector(getCurrentStep);
  const stepErrors = useSelector(getStepErrors);
  const stepValues = useSelector(getStepValues);

  const { resetForm } = useJobApplication();
  const { next, back } = useStepNavigation();

  const renderStep = () => {
    if (currentStep === STEPS.REVIEW) return <ReviewStep />;
    const config = STEP_CONFIG[currentStep];
    const stepIndex = STEP_ORDER.findIndex((step) => step === currentStep);
    return (
      <DynamicStepRenderer
        schema={config.schema}
        values={stepValues[config.valuesKey]}
        errors={stepErrors[config.valuesKey]}
        onChange={(field, value) =>
          dispatch(
            setFieldValue({
              step: currentStep,
              fieldId: field,
              value,
            }),
          )
        }
        onNext={() => next(currentStep)}
        onBack={() => back(currentStep)}
        currentStep={currentStep}
        stepIndex={stepIndex}
      />
    );
  };

  return (
    <div>
      <header className="pageHeader">
        <h1>Job Application</h1>
        <div className="headerActions">
          <div style={{ flex: 1 }}>
            <ProgressBar percent={computeVisibleFieldsProgressPercent(stepValues)} showLabel />
          </div>
          <button onClick={resetForm}>Reset Form</button>
        </div>
      </header>

      <div className="formRenderer">{renderStep()}</div>
    </div>
  );
};
