import { useDispatch, useSelector } from 'react-redux';
import type { StepId } from '../types/store.types';
import { getStepValues } from '../slice/selectors';
import { addArrayItem, updateArrayItem, removeArrayItem } from '../slice/jobApplicationSlice';
import { STEPS } from '../constants/steps';

interface PortfolioListProps {
  stepId: StepId;
  fieldId: string;
}

export const PortfolioList: React.FC<PortfolioListProps> = ({ stepId, fieldId }) => {
  const dispatch = useDispatch();
  const stepValues = useSelector(getStepValues);

  if (stepId === STEPS.REVIEW) return;

  console.log('*** portfolio steps', stepValues, stepId, fieldId);

  const list = (stepValues[stepId][fieldId] ?? []) as string[];

  return (
    <div>
      {list.length === 0 && <div style={{ marginBottom: 8, color: '#666' }}>No entries yet</div>}

      {list.map((it, idx) => (
        <div key={idx} style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
          <input
            type="url"
            value={it}
            placeholder="https://"
            onChange={(e) =>
              dispatch(
                updateArrayItem({
                  step: stepId,
                  fieldId,
                  index: idx,
                  value: e.target.value,
                }),
              )
            }
            style={{ flex: 1 }}
          />
          <button
            type="button"
            onClick={() => dispatch(removeArrayItem({ step: stepId, fieldId, index: idx }))}
          >
            Delete
          </button>
        </div>
      ))}

      <button type="button" onClick={() => dispatch(addArrayItem({ step: stepId, fieldId }))}>
        Add
      </button>
    </div>
  );
};

export default PortfolioList;
