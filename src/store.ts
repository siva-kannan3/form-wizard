import { configureStore } from '@reduxjs/toolkit';

import { jobApplicationReducer } from './features/DynamicForm';

export const store = configureStore({
  reducer: {
    jobApplication: jobApplicationReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
