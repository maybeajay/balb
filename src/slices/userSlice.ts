import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';

export interface UserState {
  userData: any[];
  loading: boolean;
  activeChatID: number | null;
}

const initialState: UserState = {
  userData: [],
  loading: true,
  activeChatID: null,
};

// Define the async thunk
export const getDataAsync = createAsyncThunk('user/getData', async () => {
  const storedData = localStorage.getItem('userInfo');
  return storedData ? JSON.parse(storedData) : [];
});

const userSlice = createSlice({
  name: 'userReducer',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    addToLocal: (state, action: PayloadAction<string>) => {
      localStorage.setItem('userInfo', action.payload);
      state.userData = JSON.parse(action.payload);
    },
    signOut: (state) => {
      localStorage.removeItem('userInfo');
      state.userData = [];
      state.loading = false;
    },
    activeChat: (state, action: PayloadAction<number | null>) => {
      state.activeChatID = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getDataAsync.pending, (state) => {
        state.loading = true;
      })
      .addCase(getDataAsync.fulfilled, (state, action: PayloadAction<any[]>) => {
        state.userData = action.payload;
        state.loading = false;
      })
      .addCase(getDataAsync.rejected, (state) => {
        state.loading = false;
      });
  },
});

export const { addToLocal, setLoading, signOut, activeChat } = userSlice.actions;
export default userSlice.reducer;
