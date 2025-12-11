import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  updatePersonalField,
  updateExperienceField,
  updateRoleField,
  addPortfolioUrl,
  updatePortfolioUrl,
  deletePortfolioUrl,
  setStepErrors,
  resetApplication,
} from '../slice/jobApplicationSlice';
import { validatePersonal, validateStepFromSchema } from '../utils/validation';
import { experienceSchema } from '../data/experienceSchema';
import { rolePreferenceSchema } from '../data/rolesSchema';
import { getStepErrors, getStepValues } from '../slice/selectors';
import { useNavigate } from 'react-router-dom';
import { clearPersistedJobApplication } from '../utils/persistence';
import type { FieldErrors, PersonalData } from '../types/store.types';

export function useJobApplication() {
  const dispatch = useDispatch();
  const values = useSelector(getStepValues);
  const errors = useSelector(getStepErrors);
  const navigate = useNavigate();

  const setPersonalField = useCallback(
    (field: keyof PersonalData, value: any) =>
      dispatch(updatePersonalField({ field: field as any, value })),
    [dispatch],
  );

  const setExperienceField = useCallback(
    (field: string, value: any) => dispatch(updateExperienceField({ field: field as any, value })),
    [dispatch],
  );

  const setRoleField = useCallback(
    (field: string, value: any) => dispatch(updateRoleField({ field: field as any, value })),
    [dispatch],
  );

  const addPortfolio = useCallback(() => dispatch(addPortfolioUrl()), [dispatch]);
  const updatePortfolio = useCallback(
    (index: number, value: string) => dispatch(updatePortfolioUrl({ index, value })),
    [dispatch],
  );
  const removePortfolio = useCallback(
    (index: number) => dispatch(deletePortfolioUrl({ index })),
    [dispatch],
  );

  const validatePersonalStep = useCallback(() => {
    return validatePersonal(values.personal);
  }, [values.personal]);

  const validateExperience = useCallback(() => {
    const stepVals = values.experience as Record<string, any>;
    return validateStepFromSchema(experienceSchema, stepVals);
  }, [values.experience]);

  const validateRole = useCallback(() => {
    const stepVals = values.role as Record<string, any>;
    return validateStepFromSchema(rolePreferenceSchema, stepVals);
  }, [values.role]);

  const pushStepErrors = useCallback(
    (step: 'personal' | 'experience' | 'role', errs: FieldErrors) => {
      dispatch(setStepErrors({ step, errors: errs }));
    },
    [dispatch],
  );

  const resetForm = useCallback(() => {
    dispatch(resetApplication());
    clearPersistedJobApplication();
    navigate('/apply/personal', { replace: true });
  }, [dispatch, navigate]);

  return {
    values,
    errors,
    // setters
    setPersonalField,
    setExperienceField,
    setRoleField,
    addPortfolio,
    updatePortfolio,
    removePortfolio,
    resetForm,
    // validators
    validatePersonalStep,
    validateExperience,
    validateRole,
    // pushers
    pushStepErrors,
  };
}
