import { createSlice } from '@reduxjs/toolkit'
export interface userState {
    userData: [],
    loading: boolean
  }

const initialState:userState={
    userData: [],
    loading: false
}
const userSlice = createSlice({
    name: "userReducer",
    initialState,
    reducers:{
        setLoading: (state, action) => {
            state.loading = action.payload;
        },
        addToLocal: (state, action)=>{
            localStorage.setItem("userInfo",action.payload);
            state.userData = action.payload
        },
        getData: (state) => {
            state.loading = true;
            const storedData = localStorage.getItem('userInfo');
            if (storedData) {
                state.userData = JSON.parse(storedData);
            }
            state.loading = false;
        },
        signOut: (state)=>{
            state.loading = true;
            localStorage.removeItem("userInfo");
            state.userData = []
            state.loading = false;
        }
    }

})

export const {addToLocal, getData, setLoading, signOut} = userSlice.actions
export default userSlice.reducer;