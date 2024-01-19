import { combineReducers, configureStore } from '@reduxjs/toolkit';
import userReducer from './user/userSlice';
import { persistReducer, persistStore } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

const rootReducer = combineReducers({ user: userReducer }); //combine all different reducers

// Configuration for persisting the Redux store
const persistConfig = {
  key: 'root',               //key for storage
  storage,                   //Storage engine (localStorage) 
  version: 1,                // Version of the persisted state
};

// Create a persisted reducer using the persistReducer function
const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, //disable checking of serializable(process of converting data structures or objects into a format that can be easily stored or transmitted, such as JSON) state and action
    }),
});

export const persistor = persistStore(store);  
