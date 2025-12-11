import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useHydrateFormFromStorage } from '../hooks/useHydrateFormFromStorage';
import { ApplicationFormWizard } from './ApplicationFormWizard';
import { isStepId, STEP_ORDER } from '../utils/steps';
import { getFirstIncompleteStep } from '../utils/validation';
import { getCurrentStep, getStepValues } from '../slice/selectors';
import { setCurrentStep } from '../slice/jobApplicationSlice';

const FormRoute: React.FC = () => {
  const { stepId } = useParams<{ stepId?: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { hydrationDone } = useHydrateFormFromStorage();
  const formValues = useSelector(getStepValues);
  const currentStep = useSelector(getCurrentStep);

  useEffect(() => {
    if (!hydrationDone) return;

    if (currentStep === stepId) return;

    if (!isStepId(stepId)) {
      const first = getFirstIncompleteStep(formValues);
      navigate(`/apply/${first}`, { replace: true });
      return;
    }

    const firstIncomplete = getFirstIncompleteStep(formValues);
    const requestedIndex = STEP_ORDER.indexOf(stepId);
    const firstIndex = STEP_ORDER.indexOf(firstIncomplete);

    if (requestedIndex > firstIndex) {
      navigate(`/apply/${firstIncomplete}`, { replace: true });
      return;
    }

    dispatch(setCurrentStep(stepId));
  }, [stepId, formValues, navigate, dispatch, hydrationDone, currentStep]);

  return <ApplicationFormWizard />;
};

export default FormRoute;
