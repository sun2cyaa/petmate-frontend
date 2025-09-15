import React, { useState } from 'react';
import axios from 'axios';
import './ImageUtil.css';

const FILE_API_BASE_URL = 'http://localhost:8090/api/files';
const STATIC_FILE_BASE_URL = 'http://localhost:8090/files';

// 이미지 URL 생성 헬퍼 함수
const getImageUrl = (filePath) => {
    if (!filePath) return null;
    // 이미 완전한 URL인 경우 그대로 반환
    if (filePath.startsWith('http')) return filePath;
    // 상대 경로인 경우 백엔드 정적 파일 URL과 결합
    return `${STATIC_FILE_BASE_URL}/${filePath}`;
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
                                src={getImageUrl(image.filePath) || image.url || image}
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
export const ImageUploadViewer = React.forwardRef(({
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
}, ref) => {
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const inputRef = React.useRef(null);

    // 이미지 목록 조회
    const loadImages = async () => {
        setLoading(true);
        setError('');
        try {
            if (referenceId) {
                const response = await fetchImagesByReference(imageTypeCode, referenceId);
                if (response.success) {
                    // setFiles는 File 객체 배열용이므로 초기화
                    setFiles([]);
                    setImages(response.images || []);
                } else {
                    throw new Error(response.message || '조회 실패');
                }
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

    // 파일 추가 핸들러 - 즉시 업로드
    const handleFiles = async (newFiles) => {
        const fileArray = Array.from(newFiles);

        // 파일 크기 검증
        const oversizedFiles = fileArray.filter(file => file.size > maxFileSize);
        if (oversizedFiles.length > 0) {
            setError(`일부 파일이 ${Math.round(maxFileSize / (1024 * 1024))}MB를 초과합니다.`);
            return;
        }

        // 즉시 업로드 실행
        await handleUploadAppend(fileArray);
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

    // 업로드 실행 (기존 이미지 교체)
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
            // 단일 모드는 기존 single 엔드포인트, 다중 모드는 replace 엔드포인트 사용
            const endpoint = mode === 'single' ? '/upload/single' : '/upload/replace';
            const response = await axios.post(`${FILE_API_BASE_URL}${endpoint}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (response.data.success) {
                onUploadSuccess(response.data);
                setFiles([]);
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

    // 기존 이미지에 새 이미지 추가 (교체가 아닌 추가)
    const handleUploadAppend = async (filesToUpload = files) => {
        if (filesToUpload.length === 0) {
            setError('파일을 선택해주세요.');
            return;
        }

        const formData = new FormData();
        filesToUpload.forEach(file => {
            formData.append('files', file);
        });
        formData.append('imageTypeCode', imageTypeCode);
        formData.append('referenceId', referenceId);
        formData.append('setFirstAsThumbnail', false);

        setLoading(true);
        setError('');

        try {
            // multiple 엔드포인트 사용 (기존 이미지에 추가)
            const response = await axios.post(`${FILE_API_BASE_URL}/upload/multiple`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (response.data.success) {
                onUploadSuccess(response.data);
                setFiles([]);
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


    // 개별 이미지 삭제
    const handleDeleteImage = async (imageId) => {
        if (!imageId) return;

        const confirmDelete = window.confirm('이 이미지를 삭제하시겠습니까?');
        if (!confirmDelete) return;

        try {
            setLoading(true);
            const response = await axios.delete(`${FILE_API_BASE_URL}/delete`, {
                params: { imageId }
            });

            if (response.data.success) {
                setImages(prev => prev.filter(img => img.imageId !== imageId));
                // 이미지 목록 새로고침
                loadImages();
            } else {
                throw new Error(response.data.message || '삭제 실패');
            }
        } catch (err) {
            const errorMessage = err.response?.data?.message || err.message || '이미지 삭제 실패';
            setError(errorMessage);
            onUploadError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    // ref를 통해 외부에서 접근할 수 있는 함수들 노출
    React.useImperativeHandle(ref, () => ({
        handleUpload,
        hasFiles: files.length > 0,
        isLoading: loading,
        // 폼 제출 시에는 업로드하지 않음 (이미 관리 모드에서 개별 업로드됨)
        skipUpload: () => {
            console.log("ImageUploadViewer: 폼 제출 시 이미지 업로드 스킵 (이미 개별 업로드됨)");
        }
    }));

    return (
        <div className={`image-upload-viewer ${className}`}>
            {loading ? (
                <div className="viewer-loading">
                    이미지 로딩 중...
                </div>
            ) : error ? (
                <div className="viewer-error">
                    {error}
                    <button onClick={loadImages} className="retry-btn">
                        다시 시도
                    </button>
                </div>
            ) : (
                // 통합 이미지 관리 화면 - 간단하게!
                <div className="simple-image-manager">
                    {/* 기존 이미지들 그리드 */}
                    {images.length > 0 && (
                        <div className="images-grid">
                            {images.map((image, index) => (
                                <div key={image.imageId || index} className="image-grid-item">
                                    <div className="image-wrapper">
                                        <img
                                            src={getImageUrl(image.filePath)}
                                            alt={image.originalName || `이미지 ${index + 1}`}
                                            className="grid-image"
                                        />
                                        <button
                                            type="button"
                                            className="delete-image-btn"
                                            onClick={() => handleDeleteImage(image.imageId)}
                                            title="이미지 삭제"
                                        >
                                            ✕
                                        </button>
                                    </div>
                                    <div className="image-info">
                                        <span className="image-name">{image.originalName}</span>
                                        {image.isThumbnail && <span className="thumbnail-badge">썸네일</span>}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* 새 이미지 추가 영역 */}
                    <div
                        className={`simple-upload-area ${images.length === 0 ? 'empty' : ''}`}
                        onClick={handleClickArea}
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={handleDrop}
                    >
                        <div className="upload-placeholder">
                            <div className="upload-icon">📁</div>
                            <p>{images.length === 0 ? '이미지를 드래그하거나 클릭하여 업로드' : '새 이미지 추가'}</p>
                            {loading && <p>업로드 중...</p>}
                        </div>
                    </div>

                    {error && (
                        <div className="error-message">{error}</div>
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
            )}
        </div>
    );
});

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
    // 조회 함수
    fetchSingleImage,
    fetchImagesByReference,

    // 뷰어 컴포넌트
    ImageSlider,
    ImageUploadViewer,

    // 유틸리티
    deleteImage,
    getImageUrl
};

// 개별 export
export { getImageUrl };