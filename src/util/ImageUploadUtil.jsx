import React, { useState } from 'react';
import axios from 'axios';
import './ImageUploadUtil.css';

const FILE_API_BASE_URL = 'http://localhost:8090/api/files';

// 단일 이미지 업로드 컴포넌트
export const SingleImageUpload = ({
    imageTypeCode = '01',
    referenceId = 1,
    onUploadSuccess = () => {},
    onUploadError = () => {},
    acceptTypes = 'image/*',
    maxFileSize = 10 * 1024 * 1024, // 10MB
    buttonText = '이미지 업로드',
    className = '',
    showPreview = true,
    disabled = false
}) => {
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [preview, setPreview] = useState(null);

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (!selectedFile) return;

        // 파일 크기 검증
        if (selectedFile.size > maxFileSize) {
            setError(`파일 크기가 ${Math.round(maxFileSize / (1024 * 1024))}MB를 초과합니다.`);
            return;
        }

        setFile(selectedFile);
        setError('');

        // 미리보기 생성
        if (showPreview && selectedFile.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = (e) => setPreview(e.target.result);
            reader.readAsDataURL(selectedFile);
        }
    };

    const handleUpload = async () => {
        if (!file) {
            setError('파일을 선택해주세요.');
            return;
        }

        const formData = new FormData();
        formData.append('file', file);
        formData.append('imageTypeCode', imageTypeCode);
        formData.append('referenceId', referenceId);

        setLoading(true);
        setError('');

        try {
            const response = await axios.post(`${FILE_API_BASE_URL}/upload/single`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (response.data.success) {
                onUploadSuccess(response.data);
                setFile(null);
                setPreview(null);
            } else {
                throw new Error(response.data.message || '업로드 실패');
            }
        } catch (err) {
            const errorMessage = err.response?.data?.message || err.message || '업로드 실패';
            setError(errorMessage);
            onUploadError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const resetFile = () => {
        setFile(null);
        setPreview(null);
        setError('');
    };

    return (
        <div className={`single-image-upload ${className}`}>
            <div className="upload-container">
                <div className="button-group">
                    <input
                        type="file"
                        accept={acceptTypes}
                        onChange={handleFileChange}
                        disabled={disabled || loading}
                        className="file-input"
                        id={`single-upload-${imageTypeCode}-${referenceId}`}
                    />
                    <label
                        htmlFor={`single-upload-${imageTypeCode}-${referenceId}`}
                        className="file-select-btn"
                    >
                        파일 선택
                    </label>
                    {file && (
                        <button
                            onClick={resetFile}
                            className="cancel-btn"
                        >
                            취소
                        </button>
                    )}
                </div>

                {file && (
                    <div className="file-info">
                        <div className="file-details">
                            <p className="file-name">선택된 파일: {file.name}</p>
                            <p className="file-size">
                                크기: {(file.size / (1024 * 1024)).toFixed(2)}MB
                            </p>
                        </div>
                        <button
                            onClick={handleUpload}
                            disabled={loading || disabled}
                            className="upload-btn"
                        >
                            {loading ? '업로드 중...' : buttonText}
                        </button>
                    </div>
                )}

                {showPreview && preview && (
                    <div className="preview-container">
                        <img src={preview} alt="미리보기" className="preview-image" />
                    </div>
                )}

                {error && (
                    <div className="error-message">
                        {error}
                    </div>
                )}
            </div>
        </div>
    );
};

// 다중 이미지 업로드 컴포넌트
export const MultipleImageUpload = ({
    imageTypeCode = '01',
    referenceId = 1,
    onUploadSuccess = () => {},
    onUploadError = () => {},
    acceptTypes = 'image/*',
    maxFileSize = 10 * 1024 * 1024, // 10MB
    maxFiles = 10,
    buttonText = '이미지 업로드',
    className = '',
    showPreview = true,
    setFirstAsThumbnail = false,
    disabled = false
}) => {
    const [files, setFiles] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [previews, setPreviews] = useState([]);

    const handleFileChange = (e) => {
        const selectedFiles = Array.from(e.target.files);

        if (selectedFiles.length > maxFiles) {
            setError(`최대 ${maxFiles}개의 파일만 선택할 수 있습니다.`);
            return;
        }

        // 파일 크기 검증
        const oversizedFiles = selectedFiles.filter(file => file.size > maxFileSize);
        if (oversizedFiles.length > 0) {
            setError(`일부 파일이 ${Math.round(maxFileSize / (1024 * 1024))}MB를 초과합니다.`);
            return;
        }

        setFiles(selectedFiles);
        setError('');

        // 미리보기 생성
        if (showPreview) {
            const newPreviews = [];
            selectedFiles.forEach((file, index) => {
                if (file.type.startsWith('image/')) {
                    const reader = new FileReader();
                    reader.onload = (e) => {
                        newPreviews[index] = e.target.result;
                        if (newPreviews.filter(Boolean).length === selectedFiles.filter(f => f.type.startsWith('image/')).length) {
                            setPreviews([...newPreviews]);
                        }
                    };
                    reader.readAsDataURL(file);
                }
            });
        }
    };

    const handleUpload = async () => {
        if (files.length === 0) {
            setError('파일을 선택해주세요.');
            return;
        }

        const formData = new FormData();
        files.forEach(file => {
            formData.append('files', file);
        });
        formData.append('imageTypeCode', imageTypeCode);
        formData.append('referenceId', referenceId);
        formData.append('setFirstAsThumbnail', setFirstAsThumbnail);

        setLoading(true);
        setError('');

        try {
            const response = await axios.post(`${FILE_API_BASE_URL}/upload/multiple`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (response.data.success) {
                onUploadSuccess(response.data);
                resetFiles();
            } else {
                throw new Error(response.data.message || '업로드 실패');
            }
        } catch (err) {
            const errorMessage = err.response?.data?.message || err.message || '업로드 실패';
            setError(errorMessage);
            onUploadError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const resetFiles = () => {
        setFiles([]);
        setPreviews([]);
        setError('');
    };

    const removeFile = (index) => {
        const newFiles = files.filter((_, i) => i !== index);
        const newPreviews = previews.filter((_, i) => i !== index);
        setFiles(newFiles);
        setPreviews(newPreviews);
    };

    return (
        <div className={`multiple-image-upload ${className}`}>
            <div className="upload-container">
                <div className="button-group">
                    <input
                        type="file"
                        accept={acceptTypes}
                        multiple
                        onChange={handleFileChange}
                        disabled={disabled || loading}
                        className="file-input"
                        id={`multiple-upload-${imageTypeCode}-${referenceId}`}
                    />
                    <label
                        htmlFor={`multiple-upload-${imageTypeCode}-${referenceId}`}
                        className="file-select-btn"
                    >
                        파일 선택 (최대 {maxFiles}개)
                    </label>
                    {files.length > 0 && (
                        <button
                            onClick={resetFiles}
                            className="cancel-btn"
                        >
                            전체 취소
                        </button>
                    )}
                </div>

                {files.length > 0 && (
                    <div className="files-container">
                        <div className="files-header">
                            <span className="files-count">
                                선택된 파일: {files.length}개
                            </span>
                            <button
                                onClick={handleUpload}
                                disabled={loading || disabled}
                                className="upload-btn"
                            >
                                {loading ? '업로드 중...' : buttonText}
                            </button>
                        </div>

                        <div className="files-list">
                            {files.map((file, index) => (
                                <div key={index} className="file-item">
                                    <div className="file-details">
                                        <p className="file-name">{file.name}</p>
                                        <p className="file-size">
                                            {(file.size / (1024 * 1024)).toFixed(2)}MB
                                        </p>
                                    </div>
                                    <button
                                        onClick={() => removeFile(index)}
                                        className="remove-btn"
                                    >
                                        제거
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {showPreview && previews.length > 0 && (
                    <div className="previews-grid">
                        {previews.map((preview, index) => preview && (
                            <div key={index} className="preview-item">
                                <img src={preview} alt={`미리보기 ${index + 1}`} />
                            </div>
                        ))}
                    </div>
                )}

                {error && (
                    <div className="error-message">
                        {error}
                    </div>
                )}
            </div>
        </div>
    );
};

// 이미지 삭제 유틸리티
export const deleteImage = async (filePath) => {
    try {
        const response = await axios.delete(`${FILE_API_BASE_URL}/delete`, {
            params: { filePath }
        });
        return response.data;
    } catch (err) {
        throw new Error(err.response?.data?.message || err.message || '삭제 실패');
    }
};

// 기본 export
export default {
    SingleImageUpload,
    MultipleImageUpload,
    deleteImage
};