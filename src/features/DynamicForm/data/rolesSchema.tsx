import { STEPS } from '../constants/steps';
import type { StepSchema } from '../types/jobApplication.types';

export const rolePreferenceSchema: StepSchema = {
  stepId: STEPS.ROLE,
  label: 'Role Preferences',
  fields: [
    {
      id: 'role',
      label: 'Role',
      type: 'string',
      rendererType: 'select',
      options: ['frontend', 'backend', 'qa'],
      required: true,
    },
    {
      id: 'reactYoe',
      label: 'React Experience (years)',
      type: 'number',
      rendererType: 'numberInput',
      min: 0,
      required: true,
      showIf: { fieldId: 'role', equals: 'frontend' },
    },
    {
      id: 'portfolioUrls',
      label: 'Portfolio URLs',
      type: 'string',
      rendererType: 'portfolioList',
      showIf: { fieldId: 'role', equals: 'frontend' },
      reviewRender: (value) => {
        if (!Array.isArray(value) || value.length === 0) return '—';
        return (
          <ul style={{ margin: 0, paddingLeft: 18 }}>
            {value.map((u, i) => (
              <li key={i} style={{ wordBreak: 'break-all', marginBottom: 6 }}>
                {u || '—'}
              </li>
            ))}
          </ul>
        );
      },
    },
    {
      id: 'nodeYoe',
      label: 'Node Experience (years)',
      type: 'number',
      rendererType: 'numberInput',
      min: 0,
      required: true,
      showIf: { fieldId: 'role', equals: 'backend' },
    },
    {
      id: 'automationExperience',
      label: 'Automation Experience (years)',
      type: 'number',
      rendererType: 'numberInput',
      min: 0,
      required: true,
      showIf: { fieldId: 'role', equals: 'qa' },
    },
  ],
};
