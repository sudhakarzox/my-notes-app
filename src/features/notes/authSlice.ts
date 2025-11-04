import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../lib/api";

interface AuthState {
  token: string | null;
  user_name: string | null;
  loading: boolean;
}

const initialState: AuthState = {
  token: typeof window !== "undefined" ? localStorage.getItem("access_token") : null,
  user_name: typeof window !== "undefined" ? localStorage.getItem("user_name") : null,
  loading: false,
};

export const login = createAsyncThunk(
  "auth/login",
  async (data: { user_email: string; password: string }) => {
    const res = await api.post("/auth/login", data);
    // expect { access_token, token_type, user_name }
    return { access_token: res.data.access_token, user_name: res.data.user_name };
  }
);

export const signup = createAsyncThunk(
  "auth/signup",
  async (data: { user_name: string; user_email: string; password: string }) => {
    await api.post("/auth/signup", data);
    return { success: true };
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: state => {
      state.token = null;
      localStorage.removeItem("access_token");
    },
  },
  extraReducers: builder => {
    builder
      .addCase(login.fulfilled, (state, action) => {
        const payload: any = action.payload;
        state.token = payload.access_token;
        state.user_name = payload.user_name ?? null;
        localStorage.setItem("access_token", payload.access_token);
        if (payload.user_name) localStorage.setItem("user_name", payload.user_name);
      })
      .addCase(signup.fulfilled, () => {
        // Don't set any state on signup, user needs to log in
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
