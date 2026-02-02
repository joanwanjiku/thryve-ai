import { configureStore } from '@reduxjs/toolkit';
import workoutsReducer from '../features/workouts/workoutsSlice';

export const store = configureStore({
  reducer: {
    workouts: workoutsReducer,
    // auth: authReducer, // if using authentication slice
  },
});
