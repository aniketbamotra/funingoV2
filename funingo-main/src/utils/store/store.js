import { configureStore } from '@reduxjs/toolkit';
import logger from 'redux-logger';
import userSlice from './slice/userSlice';
import appSlice from './slice/appSlice';
import adminSlice from './slice/adminSlice';

const store = configureStore({
  reducer: {
    userSlice,
    appSlice,
    adminSlice
  },
  middleware: getDefaultMiddleware => getDefaultMiddleware().concat(logger)
});

export default store;
