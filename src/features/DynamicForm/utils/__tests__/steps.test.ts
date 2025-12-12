import { describe, it, expect } from 'vitest';
import { getNextStep, getPreviousStep, isStepId } from '../steps';
import { STEPS } from '../../constants/steps';

describe('isStepId', () => {
  it('returns true for valid step ids', () => {
    expect(isStepId(STEPS.PERSONAL)).toBe(true);
    expect(isStepId(STEPS.EXPERIENCE)).toBe(true);
    expect(isStepId(STEPS.ROLE)).toBe(true);
    expect(isStepId(STEPS.REVIEW)).toBe(true);
  });

  it('returns false for invalid or undefined values', () => {
    expect(isStepId('invalid')).toBe(false);
    expect(isStepId('')).toBe(false);
    expect(isStepId(undefined)).toBe(false);
  });
});

describe('getNextStep', () => {
  it('returns next step for valid transitions', () => {
    expect(getNextStep(STEPS.PERSONAL)).toBe(STEPS.EXPERIENCE);
    expect(getNextStep(STEPS.EXPERIENCE)).toBe(STEPS.ROLE);
    expect(getNextStep(STEPS.ROLE)).toBe(STEPS.REVIEW);
  });

  it('returns null for last step', () => {
    expect(getNextStep(STEPS.REVIEW)).toBeNull();
  });
});

describe('getPreviousStep', () => {
  it('returns previous step for valid transitions', () => {
    expect(getPreviousStep(STEPS.EXPERIENCE)).toBe(STEPS.PERSONAL);
    expect(getPreviousStep(STEPS.ROLE)).toBe(STEPS.EXPERIENCE);
    expect(getPreviousStep(STEPS.REVIEW)).toBe(STEPS.ROLE);
  });

  it('returns null for first step', () => {
    expect(getPreviousStep(STEPS.PERSONAL)).toBeNull();
  });
});
