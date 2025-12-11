import { useRef, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { checkEmailUniqueThunk } from '../slice/thunks';
import { debounce } from '../utils/common';

export function useEmailUniqueness() {
  const dispatch = useDispatch();
  const lastAbortRef = useRef<AbortController | null>(null);

  const rawCheck = useCallback(
    async (email: string) => {
      if (!email || String(email).trim() === '') return;

      const okFormat = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(email);
      if (!okFormat) return;

      if (lastAbortRef.current) {
        lastAbortRef.current.abort();
      }
      const ac = new AbortController();
      lastAbortRef.current = ac;

      try {
        await dispatch(checkEmailUniqueThunk({ email })).unwrap();
      } catch (err) {
        if ((err as any)?.name === 'AbortError') return;
      } finally {
        if (lastAbortRef.current === ac) lastAbortRef.current = null;
      }
    },
    [dispatch],
  );

  const debounced = useRef(debounce(rawCheck, 300)).current;

  const handleEmailBlur = useCallback(
    (email: string) => {
      debounced(email);
    },
    [debounced],
  );

  return { handleEmailBlur };
}
