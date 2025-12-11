import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { isStepId } from '../utils/steps';
import { STEPS } from '../constants/steps';
import { useDispatch } from 'react-redux';
import { useHydrateFormFromStorage } from '../hooks/useHydrateFormFromStorage';

export const RedirectToStep: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { hydrationDone, persisted } = useHydrateFormFromStorage();

  useEffect(() => {
    if (!hydrationDone) return;

    if (persisted && persisted.currentStep && isStepId(persisted.currentStep)) {
      const target = persisted.currentStep;
      navigate(`/apply/${target}`, { replace: true });
      return;
    }

    navigate(`/apply/${STEPS.PERSONAL}`, { replace: true });
  }, [dispatch, hydrationDone, navigate, persisted]);

  return null;
};

export default RedirectToStep;
