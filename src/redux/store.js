import { configureStore } from "@reduxjs/toolkit";
import getFileListSlice from "./slicers/getFileListSlice";


export const store = configureStore({
    reducer: {
        fileList: getFileListSlice,
    },
});
