import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import "./FileUpload.css";
import {axiosBase} from "../../api/axiosConfig";
import {useDispatch} from "react-redux";
import {getFilesThunk} from "../../redux/slicers/getFileListSlice";

const MAX_FILE_SIZE_MB = 100;
const ALLOWED_FILE_TYPES = ["application/zip", "application/x-rar-compressed", "application/pdf", "image/png", "image/jpeg", "application/msword"];

const FileUpload = () => {
    const dispatch = useDispatch();
    const [file, setFile] = useState(null);
    const [isDragging, setIsDragging] = useState(false);

    // Проверка файла на формат и размер
    const validateFile = (selectedFile) => {
        if (!ALLOWED_FILE_TYPES.includes(selectedFile.type)) {
            toast.error("Неподдерживаемый формат файла. Пожалуйста, выберите zip, rar, pdf, png, jpg или doc файл.");
            return false;
        }
        if (selectedFile.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
            toast.error("Файл слишком большой. Максимальный размер — 100 МБ.");
            return false;
        }
        return true;
    };

    // Обработчик выбора файла
    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile && validateFile(selectedFile)) setFile(selectedFile);
    };

    // Обработчик перетаскивания файла
    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        const droppedFile = e.dataTransfer.files[0];
        if (droppedFile && validateFile(droppedFile)) setFile(droppedFile);
    };

    // Функция для отправки файла
    const handleUpload = async () => {
        try {
            const formData = new FormData();
            formData.append("file", file);

            // Отправка файла на сервер
            const response = await axiosBase.post("/api/files/upload", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            // Уведомление об успешной загрузке
            if (response.status === 200) {
                toast.success("Файл успешно загружен!");
                setFile(null);
                dispatch(getFilesThunk());
                return response.data;
            }
        } catch (error) {
            // Уведомление об ошибке
            toast.error("Ошибка при загрузке файла");
            console.error("Ошибка при загрузке файла:", error.response?.data?.message || error.message);
            throw error;
        }
    };

    // Очистка выбранного файла
    const handleClearFile = () => setFile(null);

    return (
        <div className="file-upload">
            <h3>Прикрепите файл</h3>
            <div
                className={`drop-zone ${isDragging ? "dragging" : ""}`}
                onDragOver={(e) => {
                    e.preventDefault();
                    setIsDragging(true);
                }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
                onClick={() => document.getElementById("fileInput").click()}
            >
                {file ? (
                    <div className="file-info">
                        <p className="file-name">Выбран файл: {file.name}</p>
                        <button className="clear-button" onClick={handleClearFile}>Очистить</button>
                    </div>
                ) : (
                    <p>Перетащите файл сюда или нажмите для выбора</p>
                )}
                <input
                    type="file"
                    id="fileInput"
                    onChange={handleFileChange}
                    className="file-input"
                />
            </div>
            <button onClick={handleUpload} className="upload-button" disabled={!file}>
                Загрузить
            </button>
        </div>
    );
};

export default FileUpload;
