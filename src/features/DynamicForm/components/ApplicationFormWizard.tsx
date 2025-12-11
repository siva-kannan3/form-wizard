import { useSelector } from 'react-redux';
import { getCurrentStep, getStepErrors, getStepValues } from '../slice/selectors';
import { PersonalStep } from './PersonalStep';
import { STEPS } from '../constants/steps';
import DynamicStepRenderer from './DynamicStepRenderer';
import { useJobApplication } from '../hooks/useJobApplication';
import { useStepNavigation } from '../hooks/useStepNavigation';
import { experienceSchema } from '../data/experienceSchema';
import { rolePreferenceSchema } from '../data/rolesSchema';
import ReviewStep from './ReviewStep';
import ProgressBar from './ProgressBar';
import { computeVisibleFieldsProgressPercent } from '../utils/progress';

export const ApplicationFormWizard = () => {
  const currentStep = useSelector(getCurrentStep);
  const stepErrors = useSelector(getStepErrors);
  const stepValues = useSelector(getStepValues);

  const { setExperienceField, setRoleField, resetForm } = useJobApplication();
  const { next, back } = useStepNavigation();

  const stepRenderer = () => {
    switch (currentStep) {
      case STEPS.PERSONAL:
        return <PersonalStep />;
      case STEPS.EXPERIENCE:
        return (
          <DynamicStepRenderer
            values={stepValues.experience}
            errors={stepErrors.experience}
            onChange={setExperienceField}
            onNext={() => next(currentStep)}
            onBack={() => back(currentStep)}
            schema={experienceSchema}
          />
        );
      case STEPS.ROLE:
        return (
          <DynamicStepRenderer
            values={stepValues.role}
            errors={stepErrors.role}
            onChange={setRoleField}
            onNext={() => next(currentStep)}
            onBack={() => back(currentStep)}
            schema={rolePreferenceSchema}
          />
        );
      case STEPS.REVIEW:
        return <ReviewStep />;
      default:
        return null;
    }
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

      <div className="formRenderer">{stepRenderer()}</div>
    </div>
  );
};
