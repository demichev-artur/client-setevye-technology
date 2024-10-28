
import React, { useEffect, useState } from "react";

import "./FileItems.css";
import {axiosBase} from "../../api/axiosConfig";
import {useDispatch, useSelector} from "react-redux";
import {getFilesThunk} from "../../redux/slicers/getFileListSlice";
import {getFileThunk} from "../../redux/slicers/getFileSlice"; // Импортируем стили

const FileItems = () => {
    const dispatch = useDispatch();
    const {files, loading, error} = useSelector(state => state.fileList);


    useEffect(() => {
        dispatch(getFilesThunk());
    }, [dispatch]);



    const handleDownload = async (filename) => {
        const resultAction = await dispatch(getFileThunk(filename));
        if (getFileThunk.fulfilled.match(resultAction)) {
            // Создаем URL для Blob
            const url = window.URL.createObjectURL(new Blob([resultAction.payload.file]));
            const a = document.createElement("a");
            a.href = url;
            a.download = resultAction.payload.filename; // Указываем имя для скачивания
            document.body.appendChild(a);
            a.click();
            a.remove();
            window.URL.revokeObjectURL(url); // Очищаем URL
        }
    };

    if (loading === "pending") return <div>Загрузка...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div className="file-items-container">
            <h2>Список файлов</h2>
            <ul className="file-items-list">
                {files.map((file) => (
                    <li key={file._id} className="file-item" onClick={() => handleDownload(file.filename)}>
                        <a href="#" onClick={(e) => e.preventDefault()}>{file.filename}</a>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default FileItems;
