import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { loadPersistedJobApplication } from '../utils/persistence';
import { setValuesFromLocalStorage } from '../slice/jobApplicationSlice';
import type { PersistedApp } from '../types/persistence.types';

export function useHydrateFormFromStorage() {
  const dispatch = useDispatch();
  const [hydrationDone, setHydratedDone] = useState(false);
  const [persisted, setPersisted] = useState<PersistedApp | null>(null);

  useEffect(() => {
    try {
      const data = loadPersistedJobApplication();
      if (!data) {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setHydratedDone(true);
        setPersisted(null);
        return;
      }

      dispatch(
        setValuesFromLocalStorage({
          values: data.values,
        }),
      );

      setPersisted(data);
      setHydratedDone(true);
    } catch (e) {
      console.warn('Hydration failed', e);
      setHydratedDone(true);
      setPersisted(null);
    }
  }, [dispatch]);

  return { hydrationDone, persisted };
}
