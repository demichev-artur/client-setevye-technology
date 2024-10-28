import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { axiosBase } from "../../api/axiosConfig";

export const getFilesThunk = createAsyncThunk(
    "files/getFilesThunk",
    async (_, thunkAPI) => {
        try {
            const response = await axiosBase.get("/api/files");
            console.log(response)
            return response.data;
        } catch (error) {
            console.log(error);
            return thunkAPI.rejectWithValue(error.message);
        }
    }
);

const initialState = {
    files: [],
    loading: "idle",
    error: null,
};
const getFileListSlice = createSlice({
    name: "files",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(getFilesThunk.pending, (state, action) => {
            state.loading = "pending";
            state.error = null;
        });
        builder.addCase(getFilesThunk.fulfilled, (state, action) => {
            state.loading = "succeeded";
            state.files = action.payload;
        });
        builder.addCase(getFilesThunk.rejected, (state, action) => {
            state.loading = "failed";
            state.error = action.payload;
        });
    },
});

export default getFileListSlice.reducer;
