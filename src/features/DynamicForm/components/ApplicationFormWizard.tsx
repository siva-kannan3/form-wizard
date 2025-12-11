import { useSelector } from 'react-redux';
import { getCurrentStep, getStepErrors, getStepValues } from '../slice/selectors';
import { PersonalStep } from './PersonalStep';
import { STEPS } from '../constants/steps';
import DynamicStepRenderer from './DynamicStepRenderer';
import { useJobApplication } from '../hooks/useJobApplication';
import { useStepNavigation } from '../hooks/useStepNavigation';
import { experienceSchema } from '../data/experienceSchema';
import { rolePreferenceSchema } from '../data/rolesSchema';

export const ApplicationFormWizard = () => {
  const currentStep = useSelector(getCurrentStep);
  const stepErrors = useSelector(getStepErrors);
  const stepValues = useSelector(getStepValues);

  const { setExperienceField, setRoleField } = useJobApplication();
  const { next, back } = useStepNavigation();

  if (currentStep === STEPS.PERSONAL) {
    return <PersonalStep />;
  } else if (currentStep === STEPS.EXPERIENCE) {
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
  } else if (currentStep === STEPS.ROLE) {
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
  }

  return <div>Application Form Wizard</div>;
};
