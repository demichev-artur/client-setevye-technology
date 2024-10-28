import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { axiosBase } from "../../api/axiosConfig";

export const getFileThunk = createAsyncThunk(
    "files/getFile",
    async (filename, thunkAPI) => {
        try {
            const response = await axiosBase.get(`/files/${filename}`, {
                responseType: "blob", // Указываем, что ожидаем Blob
            });

            // Возвращаем имя файла для использования в UI
            return { file: response.data, filename }; // Возвращаем blob и имя файла
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data.message);
        }
    }
);

const initialState = {
    file: [],
    loading: "idle",
    error: null,
};
const getFileListSlice = createSlice({
    name: "files",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(getFileThunk.pending, (state, action) => {
            state.loading = "pending";
            state.error = null;
        });
        builder.addCase(getFileThunk.fulfilled, (state, action) => {
            state.loading = "succeeded";
            state.file = action.payload;
        });
        builder.addCase(getFileThunk.rejected, (state, action) => {
            state.loading = "failed";
            state.error = action.payload;
        });
    },
});

export default getFileListSlice.reducer;
