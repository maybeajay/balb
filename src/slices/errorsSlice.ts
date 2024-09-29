import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import toast from 'react-hot-toast';

export interface UserState {
    loading: boolean,
    error: string | null
}

const initialState: UserState = {
    loading: false,
    error: null
}

const errorSlice = createSlice({
    name: "errorReducer",
    initialState,
    reducers: {
        setLoading: (state, action: PayloadAction<boolean>) => {
            state.loading = action.payload;
        },
        catchErrors: (state, action: PayloadAction<string>) => {
            state.error = action.payload;
            toast.error(action.payload);
        }
    }
})

export const { setLoading, catchErrors } = errorSlice.actions
export default errorSlice.reducer;
