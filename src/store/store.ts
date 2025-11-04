import { configureStore } from "@reduxjs/toolkit";
import notesReducer from "../features/notes/noteSlice";
import authReducer from "../features/notes/authSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    notes: notesReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
