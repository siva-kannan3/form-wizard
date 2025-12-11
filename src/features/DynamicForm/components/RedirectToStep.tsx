import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import type { RootState } from '../../../store';
import { getFirstIncompleteStep } from '../utils/validation';
// import { isStepId, STEP_ORDER } from '../utils/steps';

export const RedirectToStep: React.FC = () => {
  const navigate = useNavigate();
  const values = useSelector((s: RootState) => s.jobApplication.values);

  useEffect(() => {
    // const persistedData = loadPersistedJobApplication();

    const firstIncomplete = getFirstIncompleteStep(values);

    // if (persistedData && persistedData.currentStep && isStepId(persistedData.currentStep)) {
    //   const persistedIndex = STEP_ORDER.indexOf(persistedData.currentStep);
    //   const firstIndex = STEP_ORDER.indexOf(firstIncomplete);

    //   // If persisted step is not ahead of firstIncomplete, resume there,
    //   // otherwise fall back to firstIncomplete.
    //   const target = persistedIndex <= firstIndex ? persistedData.currentStep : firstIncomplete;
    //   navigate(`/apply/${target}`, { replace: true });
    //   return;
    // }

    navigate(`/apply/${firstIncomplete}`, { replace: true });
  }, [navigate, values]);

  return null;
};

export default RedirectToStep;
