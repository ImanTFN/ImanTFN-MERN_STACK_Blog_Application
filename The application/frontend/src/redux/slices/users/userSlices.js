import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import axios from "axios";
import baseUrl from "../../../utils/baseURL";


// register action


export const registerUserAction = createAsyncThunk("users/register" , async (user, {rejectWithValue, getState, dispatch})=>{
        try{
            //http call
            const config = {
                headers:{
                    "Content-Type": "application/json",
                },
            };
            const {data} = await axios.post(`${baseUrl}/api/users/register`,
            user,config );
            return data;
        } catch ( error ){
            if(!error?.response){
                throw error;
            }
            return rejectWithValue(error?.response?.data);
        }
    }
);

//Login
export const loginUserAction = createAsyncThunk(
    "user.login",
    async (userData, {rejectWithValue, getState, dispatch})=>{
        const config = {
            headers: {
                "Content-Type": "application/json"
            },
        };
        try {
            //make http call
            const {data} = await axios.post(`${baseUrl}/api/users/login`,
            userData,
            config);
            //save user into ocal storage
            localStorage.setItem("userInfo",JSON.stringify(data));
            return data;
        } catch (error) {
            if(!error?.response){
                throw error;
            }
            return rejectWithValue(error?.response?.data);
        }
    }
);

//logout action

export const logoutAction = createAsyncThunk(
    "/user/logout", 
    async (payload, {rejectWithValue, getState, dispatch}) => {
        try {
            localStorage.removeItem("userInfo");
        } catch (error) {
            if(!error?.response){
                throw error;
            }
            return rejectWithValue(error?.response?.data);
        }
    }
);

//get user from local storage and place into store
const userLoginFromStorage = localStorage.getItem("userInfo")
 ? JSON.parse(localStorage.getItem("userInfo"))
 : null;

//slices
const usersSlices = createSlice({
    name:"users",
    initialState:{
        userAuth: userLoginFromStorage,
    },
    extraReducers: (builder)=>{
        //register
        builder.addCase(registerUserAction.pending,(state,action)=>{
            state.loading = true;
            state.appErr = undefined;
            state.serverErr = undefined;
        });
        builder.addCase(registerUserAction.fulfilled,(state,action)=>{
            state.loading = false;
            state.registered = action?.payload;
            state.appErr = undefined;
            state.serverErr = undefined;
        });
        builder.addCase(registerUserAction.rejected , (state, action)=>{
            state.loading = false;
            state.appErr = action?.payload?.message;
            state.serverErr = action?.error?.message;
        });

        //login
        builder.addCase(loginUserAction.pending, (state, action )=>{
            state.loading = true;
            state.appErr = undefined;
            state.serverErr = undefined;
        });
        builder.addCase(loginUserAction.fulfilled, (state, action)=>{
            state.userAuth = action?.payload;
            state.loading = false;
            state.appErr = undefined;
            state.serverErr = undefined;
        });
        builder.addCase(loginUserAction.rejected, (state, action)=>{
            state.appErr = action?.payload?.message;
            state.serverErr = action?.error?.message;
            state.loading = false;
        });
        //logout
        builder.addCase(logoutAction.pending, (state, action)=>{
            state.loading = false;
        });
        builder.addCase(logoutAction.fulfilled, (state, action) => {
            state.userAuth = undefined;
            state.loading = false;
            state.appErr = undefined;
            state.serverErr = undefined;
        });
        builder.addCase(logoutAction.rejected, (state, action)=>{
            state.appErr = action?.payload?.message;
            state.serverErr = action?.error?.message;
            state.loading = false;
        });
    },
});

export default usersSlices.reducer;
