import { configureStore } from '@reduxjs/toolkit';

import { jobApplicationReducer, persistMiddleware } from './features/DynamicForm';

export const store = configureStore({
  reducer: {
    jobApplication: jobApplicationReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({}).concat(persistMiddleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
