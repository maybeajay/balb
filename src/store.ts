import { configureStore } from "@reduxjs/toolkit";
import userReducer from './slices/userSlice'
import errorReducer from './slices/errorsSlice'
export const store = configureStore({
    reducer: {
        user: userReducer,
        error: errorReducer
    },
    middleware: (getDefaultMiddleware)=>getDefaultMiddleware()
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch