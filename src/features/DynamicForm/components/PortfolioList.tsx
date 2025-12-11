import { useDispatch, useSelector } from 'react-redux';
import { getStepValues } from '../slice/selectors';
import {
  addPortfolioUrl,
  deletePortfolioUrl,
  updatePortfolioUrl,
} from '../slice/jobApplicationSlice';

export const PortfolioList = () => {
  const dispatch = useDispatch();
  const stepValues = useSelector(getStepValues);

  const list = stepValues.role.portfolioUrls;

  const handleAdd = () => {
    dispatch(addPortfolioUrl());
  };

  const handleUpdate = (idx: number, val: string) => {
    dispatch(updatePortfolioUrl({ index: idx, value: val }));
  };

  const handleRemove = (idx: number) => {
    dispatch(deletePortfolioUrl({ index: idx }));
  };
  return (
    <div>
      {list.length === 0 && <div style={{ marginBottom: 8, color: '#666' }}>No entries yet</div>}

      {list.map((it, idx) => (
        <div key={idx} style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
          <input
            type="url"
            value={it}
            placeholder={'https://'}
            onChange={(e) => handleUpdate(idx, e.target.value)}
            style={{ flex: 1 }}
          />
          <button type="button" onClick={() => handleRemove(idx)}>
            Delete
          </button>
        </div>
      ))}

      <button type="button" onClick={handleAdd}>
        Add
      </button>
    </div>
  );
};

export default PortfolioList;
