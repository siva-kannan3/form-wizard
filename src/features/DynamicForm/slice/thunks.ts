import { createAsyncThunk } from '@reduxjs/toolkit';
import { checkEmailUniqueApi } from '../api/mockValidationApi';

export const checkEmailUniqueThunk = createAsyncThunk<
  { email: string },
  { email: string },
  { rejectValue: { email: string; reason: string } }
>('jobApplication/checkEmailUnique', async ({ email }, { signal, rejectWithValue }) => {
  try {
    const res = await checkEmailUniqueApi(email, signal as unknown as AbortSignal);
    if (!res.ok) {
      return rejectWithValue({ email, reason: res.reason });
    }
    return { email };
  } catch (err: any) {
    if (err?.name === 'AbortError') {
      throw err;
    }
    return rejectWithValue({ email, reason: 'error' });
  }
});
