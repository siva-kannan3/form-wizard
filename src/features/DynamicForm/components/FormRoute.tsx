import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import type { AppDispatch } from '../../../store';
import { isStepId, STEP_ORDER } from '../utils/steps';
import { getFirstIncompleteStep } from '../utils/validation';
import { getStepValues } from '../slice/selectors';
import { setCurrentStep } from '../slice/jobApplicationSlice';
import { ApplicationFormWizard } from './ApplicationFormWizard';

export const ApplicationFormWizardRoute: React.FC = () => {
  const { stepId } = useParams<{ stepId?: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const formValues = useSelector(getStepValues);

  useEffect(() => {
    if (!isStepId(stepId)) {
      const first = getFirstIncompleteStep(formValues);
      navigate(`/apply/${first}`, { replace: true });
      return;
    }

    const firstIncomplete = getFirstIncompleteStep(formValues);
    const requestedIndex = STEP_ORDER.indexOf(stepId as any);
    const firstIndex = STEP_ORDER.indexOf(firstIncomplete);

    if (requestedIndex > firstIndex) {
      navigate(`/apply/${firstIncomplete}`, { replace: true });
      return;
    }

    dispatch(setCurrentStep(stepId as any));
  }, [stepId, formValues, navigate, dispatch]);

  return <ApplicationFormWizard />;
};

export default ApplicationFormWizardRoute;
