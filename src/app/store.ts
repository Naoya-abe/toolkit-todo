import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import taskReducer from '../features/task/taskSlice';

export const store = configureStore({
  reducer: {
    task: taskReducer,
  },
});

// コンポーネント側でstate参照する時に、型注釈に使用するのでexport
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
