import { createSlice } from '@reduxjs/toolkit'
export interface userState {
    userData: [],
    loading: boolean,
    activeChatID: []
  }

const initialState:userState={
    userData: [],
    loading: false,
    activeChatID: []
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
        },
        activeChat: (state, action)=>{
            state.activeChatID = action.payload
        }
    }

})

export const {addToLocal, getData, setLoading, signOut, activeChat} = userSlice.actions
export default userSlice.reducer;