import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { getStepValues } from '../slice/selectors';
import { useJobApplication } from './useJobApplication';
import { getFirstIncompleteStep } from '../utils/validation';
import { getNextStep, getPreviousStep, STEP_ORDER } from '../utils/steps';
import type { StepId } from '../slice/jobApplicationSlice';
import { STEPS } from '../constants/steps';

export function useStepNavigation() {
  const navigate = useNavigate();
  const values = useSelector(getStepValues);
  const { validatePersonalStep, validateExperience, validateRole, pushStepErrors } =
    useJobApplication();

  const goTo = useCallback(
    (stepId: StepId) => {
      const firstIncomplete = getFirstIncompleteStep(values);

      const requestedIndex = STEP_ORDER.indexOf(stepId);
      const firstIndex = STEP_ORDER.indexOf(firstIncomplete);
      const target = requestedIndex <= firstIndex ? stepId : firstIncomplete;
      navigate(`/apply/${target}`);
    },
    [navigate, values],
  );

  const next = useCallback(
    (currentStep: StepId) => {
      if (currentStep === STEPS.PERSONAL) {
        const errs = validatePersonalStep();
        pushStepErrors(STEPS.PERSONAL, errs);
        if (Object.keys(errs).length > 0) return; // stop on error
      } else if (currentStep === STEPS.EXPERIENCE) {
        const errs = validateExperience();
        pushStepErrors(STEPS.EXPERIENCE, errs);
        if (Object.keys(errs).length > 0) return;
      } else if (currentStep === STEPS.ROLE) {
        const errs = validateRole();
        pushStepErrors(STEPS.ROLE, errs);
        if (Object.keys(errs).length > 0) return;
      }

      const nextStep = getNextStep(currentStep as any);
      if (nextStep) navigate(`/apply/${nextStep}`);
    },
    [navigate, validatePersonalStep, validateExperience, validateRole, pushStepErrors],
  );

  const back = useCallback(
    (currentStep: string) => {
      const prev = getPreviousStep(currentStep as any);
      if (prev) navigate(`/apply/${prev}`);
    },
    [navigate],
  );

  return {
    goTo,
    next,
    back,
  };
}
