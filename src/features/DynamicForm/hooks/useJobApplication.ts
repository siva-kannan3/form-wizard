import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { resetApplication } from '../slice/jobApplicationSlice';
import { getStepErrors, getStepValues } from '../slice/selectors';
import { useNavigate } from 'react-router-dom';
import { clearPersistedJobApplication } from '../utils/persistence';

export function useJobApplication() {
  const dispatch = useDispatch();
  const values = useSelector(getStepValues);
  const errors = useSelector(getStepErrors);
  const navigate = useNavigate();

  const resetForm = useCallback(() => {
    dispatch(resetApplication());
    clearPersistedJobApplication();
    navigate('/apply/personal', { replace: true });
  }, [dispatch, navigate]);

  return {
    values,
    errors,
    resetForm,
  };
}
