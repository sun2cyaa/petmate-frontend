import React, { useState } from 'react';
import axios from 'axios';
import './ImageUtil.css';

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

// ====== 이미지 조회 기능 ======

// 단일 이미지 조회
export const fetchSingleImage = async (filePath) => {
    try {
        const response = await axios.get(`${FILE_API_BASE_URL}/view`, {
            params: { filePath }
        });
        return response.data;
    } catch (err) {
        throw new Error(err.response?.data?.message || err.message || '조회 실패');
    }
};

// 참조 기준 다중 이미지 조회
export const fetchImagesByReference = async (imageTypeCode, referenceId) => {
    try {
        const response = await axios.get(`${FILE_API_BASE_URL}/list`, {
            params: { imageTypeCode, referenceId }
        });
        return response.data;
    } catch (err) {
        throw new Error(err.response?.data?.message || err.message || '조회 실패');
    }
};

// ====== 이미지 뷰어 컴포넌트 ======

// 가로 슬라이드 이미지 뷰어
export const ImageSlider = ({
    images = [],
    className = '',
    showDots = true,
    showArrows = true,
    autoSlide = false,
    slideInterval = 3000,
    onImageClick = () => {},
    loading = false,
    errorMessage = '',
    emptyMessage = '이미지가 없습니다.'
}) => {
    const [currentIndex, setCurrentIndex] = React.useState(0);
    const [isAutoPlaying, setIsAutoPlaying] = React.useState(autoSlide);
    const intervalRef = React.useRef(null);

    React.useEffect(() => {
        if (isAutoPlaying && images.length > 1) {
            intervalRef.current = setInterval(() => {
                setCurrentIndex((prev) => (prev + 1) % images.length);
            }, slideInterval);
        } else {
            clearInterval(intervalRef.current);
        }

        return () => clearInterval(intervalRef.current);
    }, [isAutoPlaying, images.length, slideInterval]);

    const goToSlide = (index) => {
        setCurrentIndex(index);
    };

    const goToPrevious = () => {
        setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
    };

    const goToNext = () => {
        setCurrentIndex((prev) => (prev + 1) % images.length);
    };

    const handleMouseEnter = () => {
        if (autoSlide) setIsAutoPlaying(false);
    };

    const handleMouseLeave = () => {
        if (autoSlide) setIsAutoPlaying(true);
    };

    if (loading) {
        return (
            <div className={`image-slider loading ${className}`}>
                <div className="slider-loading">이미지 로딩 중...</div>
            </div>
        );
    }

    if (errorMessage) {
        return (
            <div className={`image-slider error ${className}`}>
                <div className="slider-error">{errorMessage}</div>
            </div>
        );
    }

    if (!images || images.length === 0) {
        return (
            <div className={`image-slider empty ${className}`}>
                <div className="slider-empty">{emptyMessage}</div>
            </div>
        );
    }

    return (
        <div
            className={`image-slider ${className}`}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            <div className="slider-container">
                {showArrows && images.length > 1 && (
                    <>
                        <button
                            className="slider-arrow prev"
                            onClick={goToPrevious}
                            aria-label="이전 이미지"
                        >
                            ‹
                        </button>
                        <button
                            className="slider-arrow next"
                            onClick={goToNext}
                            aria-label="다음 이미지"
                        >
                            ›
                        </button>
                    </>
                )}

                <div className="slider-track">
                    {images.map((image, index) => (
                        <div
                            key={index}
                            className={`slider-slide ${index === currentIndex ? 'active' : ''}`}
                            onClick={() => onImageClick(image, index)}
                        >
                            <img
                                src={image.filePath || image.url || image}
                                alt={image.alt || `슬라이드 ${index + 1}`}
                                className="slider-image"
                            />
                        </div>
                    ))}
                </div>
            </div>

            {showDots && images.length > 1 && (
                <div className="slider-dots">
                    {images.map((_, index) => (
                        <button
                            key={index}
                            className={`slider-dot ${index === currentIndex ? 'active' : ''}`}
                            onClick={() => goToSlide(index)}
                            aria-label={`${index + 1}번째 이미지로 이동`}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

// 조회+업로드 통합 컴포넌트 (CompanyRegisterPage 스타일 적용)
export const ImageUploadViewer = ({
    imageTypeCode = '01',
    referenceId = 1,
    mode = 'single', // 'single' | 'multiple'
    onUploadSuccess = () => {},
    onUploadError = () => {},
    onViewError = () => {},
    acceptTypes = 'image/*',
    maxFileSize = 10 * 1024 * 1024,
    maxFiles = 10,
    className = '',
    emptyPlaceholder = '이미지를 업로드하려면 클릭하거나 드래그하세요',
    disabled = false,
    files,
    setFiles
}) => {
    const [images, setImages] = useState([]);
    // const [uploadFiles, setUploadFiles] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [uploadMode, setUploadMode] = useState(false);
    const inputRef = React.useRef(null);

    // 이미지 목록 조회
    const loadImages = async () => {
        setLoading(true);
        setError('');
        try {
            const response = await fetchImagesByReference(imageTypeCode, referenceId);
            if (response.success) {
                setImages(response.data || []);
            } else {
                throw new Error(response.message || '조회 실패');
            }
        } catch (err) {
            const errorMessage = err.message || '이미지 조회 실패';
            setError(errorMessage);
            onViewError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    // 컴포넌트 마운트 시 이미지 로드
    React.useEffect(() => {
        loadImages();
    }, [imageTypeCode, referenceId]);

    // 파일 추가 핸들러 (CompanyRegisterPage 방식)
    const handleFiles = (newFiles) => {
        const fileArray = Array.from(newFiles);

        // 파일 크기 검증
        const oversizedFiles = fileArray.filter(file => file.size > maxFileSize);
        if (oversizedFiles.length > 0) {
            setError(`일부 파일이 ${Math.round(maxFileSize / (1024 * 1024))}MB를 초과합니다.`);
            return;
        }

        if (mode === 'single') {
            // 단일 모드: 기존 파일 대체
            setFiles(fileArray.slice(0, 1));
        } else {
            // 다중 모드: 파일 추가 (최대 개수 제한)
            setFiles(prev => {
                const combined = [...prev, ...fileArray];
                if (combined.length > maxFiles) {
                    setError(`최대 ${maxFiles}개의 파일만 업로드할 수 있습니다.`);
                    return combined.slice(0, maxFiles);
                }
                return combined;
            });
        }
        setError('');
    };

    // 드래그&드롭 핸들러
    const handleDrop = (e) => {
        e.preventDefault();
        handleFiles(e.dataTransfer.files);
    };

    // 클릭 업로드
    const handleClickArea = () => {
        inputRef.current?.click();
    };

    // 파일 삭제
    const handleRemoveFile = (indexToRemove) => {
        setFiles(prev => prev.filter((_, index) => index !== indexToRemove));
    };

    // 업로드 실행
    const handleUpload = async () => {
        if (files.length === 0) {
            setError('파일을 선택해주세요.');
            return;
        }

        const formData = new FormData();
        if (mode === 'single') {
            formData.append('file', files[0]);
        } else {
            files.forEach(file => {
                formData.append('files', file);
            });
            formData.append('setFirstAsThumbnail', false);
        }
        formData.append('imageTypeCode', imageTypeCode);
        formData.append('referenceId', referenceId);

        setLoading(true);
        setError('');

        try {
            const endpoint = mode === 'single' ? '/upload/single' : '/upload/multiple';
            const response = await axios.post(`${FILE_API_BASE_URL}${endpoint}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (response.data.success) {
                onUploadSuccess(response.data);
                setFiles([]);
                setUploadMode(false);
                loadImages(); // 목록 새로고침
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

    // 업로드 모드 진입
    const handleStartUpload = () => {
        setUploadMode(true);
        setFiles([]);
        setError('');
    };

    // 업로드 취소
    const handleCancelUpload = () => {
        setUploadMode(false);
        setFiles([]);
        setError('');
    };

    return (
        <div className={`image-upload-viewer ${className}`}>
            {loading ? (
                <div className="viewer-loading">
                    이미지 로딩 중...
                </div>
            ) : error && !uploadMode ? (
                <div className="viewer-error">
                    {error}
                    <button onClick={loadImages} className="retry-btn">
                        다시 시도
                    </button>
                </div>
            ) : images.length === 0 && !uploadMode ? (
                // 이미지 없음 - 업로드 영역 표시
                <div
                    className={`viewer-empty ${!disabled ? 'clickable' : ''}`}
                    onClick={!disabled ? handleClickArea : undefined}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={!disabled ? handleDrop : undefined}
                >
                    <div className="empty-placeholder">
                        <div className="upload-icon">📷</div>
                        <p>{emptyPlaceholder}</p>
                    </div>
                    <input
                        type="file"
                        accept={acceptTypes}
                        multiple={mode === 'multiple'}
                        ref={inputRef}
                        onChange={(e) => {
                            handleFiles(e.target.files);
                            setUploadMode(true);
                        }}
                        style={{ display: 'none' }}
                    />
                </div>
            ) : uploadMode ? (
                // 업로드 모드
                <div className="upload-area">
                    <div className="upload-header">
                        <h3>{mode === 'single' ? '이미지 업로드' : '이미지들 업로드'}</h3>
                    </div>

                    <div
                        className="file-upload-area"
                        onClick={files.length === 0 ? handleClickArea : undefined}
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={handleDrop}
                    >
                        {files.length === 0 ? (
                            <div className="upload-placeholder">
                                <div className="upload-icon">📁</div>
                                <p>여기에 이미지를 드래그하거나 클릭해서 업로드하세요</p>
                                <small>{mode === 'single' ? '1개 파일' : `최대 ${maxFiles}개 파일`}</small>
                            </div>
                        ) : (
                            <div className="uploaded-files">
                                {files.map((file, index) => (
                                    <div key={index} className="file-item">
                                        <img
                                            src={URL.createObjectURL(file)}
                                            alt={file.name}
                                            className="file-preview"
                                        />
                                        <button
                                            type="button"
                                            className="file-remove-btn"
                                            onClick={() => handleRemoveFile(index)}
                                        >
                                            ✕
                                        </button>
                                        <p className="file-name">{file.name}</p>
                                    </div>
                                ))}

                                {mode === 'multiple' && files.length < maxFiles && (
                                    <div className="add-more-files" onClick={handleClickArea}>
                                        + 추가
                                    </div>
                                )}
                            </div>
                        )}

                        <input
                            type="file"
                            accept={acceptTypes}
                            multiple={mode === 'multiple'}
                            ref={inputRef}
                            onChange={(e) => handleFiles(e.target.files)}
                            style={{ display: 'none' }}
                        />
                    </div>

                    {error && (
                        <div className="error-message">{error}</div>
                    )}

                    <div className="upload-actions">
                        <button
                            type="button"
                            onClick={handleCancelUpload}
                            className="cancel-btn"
                        >
                            취소
                        </button>
                        <button
                            type="button"
                            onClick={handleUpload}
                            disabled={loading || files.length === 0}
                            className="upload-btn"
                        >
                            {loading ? '업로드 중...' : `업로드 (${files.length}개)`}
                        </button>
                    </div>
                </div>
            ) : (
                // 이미지 보기 모드
                <div className="viewer-images">
                    {mode === 'single' ? (
                        <div className="single-image-view">
                            <img
                                src={images[0]?.filePath}
                                alt="업로드된 이미지"
                                className="single-image"
                            />
                            <div className="image-actions">
                                <button
                                    onClick={handleStartUpload}
                                    className="change-btn"
                                    disabled={disabled}
                                >
                                    변경
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="multiple-images-view">
                            <ImageSlider
                                images={images}
                                showDots={true}
                                showArrows={true}
                                className="viewer-slider"
                            />
                            <div className="image-actions">
                                <button
                                    onClick={handleStartUpload}
                                    className="add-btn"
                                    disabled={disabled}
                                >
                                    이미지 추가
                                </button>
                                <button
                                    onClick={loadImages}
                                    className="refresh-btn"
                                >
                                    새로고침
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            )}
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
    // 업로드 컴포넌트
    SingleImageUpload,
    MultipleImageUpload,

    // 조회 함수
    fetchSingleImage,
    fetchImagesByReference,

    // 뷰어 컴포넌트
    ImageSlider,
    ImageUploadViewer,

    // 유틸리티
    deleteImage
};