import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { getStepValues } from '../slice/selectors';
import { useJobApplication } from './useJobApplication';
import { getFirstIncompleteStep } from '../utils/validation';
import { getNextStep, getPreviousStep, STEP_ORDER } from '../utils/steps';
import type { StepId } from '../slice/jobApplicationSlice';
import { JOB_APPLICATION_LOCAL_STORAGE_VERSION, STEPS } from '../constants/steps';
import { savePersistedJobApplication } from '../utils/persistence';

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
        if (Object.keys(errs).length > 0) return;
      } else if (currentStep === STEPS.EXPERIENCE) {
        const errs = validateExperience();
        pushStepErrors(STEPS.EXPERIENCE, errs);
        if (Object.keys(errs).length > 0) return;
      } else if (currentStep === STEPS.ROLE) {
        const errs = validateRole();
        pushStepErrors(STEPS.ROLE, errs);
        if (Object.keys(errs).length > 0) return;
      }

      savePersistedJobApplication({
        currentStep,
        values,
        version: JOB_APPLICATION_LOCAL_STORAGE_VERSION,
        updatedAt: new Date().toISOString(),
      });

      const nextStep = getNextStep(currentStep);
      if (nextStep) navigate(`/apply/${nextStep}`);
    },
    [values, navigate, validatePersonalStep, pushStepErrors, validateExperience, validateRole],
  );

  const back = useCallback(
    (currentStep: StepId) => {
      const prev = getPreviousStep(currentStep);
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
