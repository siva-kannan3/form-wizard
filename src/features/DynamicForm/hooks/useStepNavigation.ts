import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { getStepValues } from '../slice/selectors';
import { setStepErrors } from '../slice/jobApplicationSlice';
import { getFirstIncompleteStep, validateStep } from '../utils/validation';
import { getNextStep, getPreviousStep, STEP_ORDER } from '../utils/steps';
import { savePersistedJobApplication } from '../utils/persistence';
import type { StepId } from '../types/store.types';
import { JOB_APPLICATION_LOCAL_STORAGE_VERSION } from '../constants/common';

export function useStepNavigation() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const values = useSelector(getStepValues);

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
      if (currentStep !== 'review') {
        const errors = validateStep(currentStep, values);

        dispatch(
          setStepErrors({
            step: currentStep,
            errors,
          }),
        );

        if (Object.keys(errors).length > 0) {
          return;
        }
      }

      // persist progress
      savePersistedJobApplication({
        currentStep,
        values,
        version: JOB_APPLICATION_LOCAL_STORAGE_VERSION,
        updatedAt: new Date().toISOString(),
      });

      const nextStep = getNextStep(currentStep);
      if (nextStep) {
        navigate(`/apply/${nextStep}`);
      }
    },
    [values, navigate, dispatch],
  );

  const back = useCallback(
    (currentStep: StepId) => {
      const prev = getPreviousStep(currentStep);
      if (prev) {
        navigate(`/apply/${prev}`);
      }
    },
    [navigate],
  );

  return {
    goTo,
    next,
    back,
  };
}
