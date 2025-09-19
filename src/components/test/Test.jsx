import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Test.css';
import {
    ImageSlider,
    ImageUploadViewer,
    fetchImagesByReference,
    fetchSingleImage
} from '../../util/ImageUtil';

<<<<<<< HEAD
const API_BASE_URL = 'http://localhost:8090/api/test/jpa';
const FILE_API_BASE_URL = 'http://localhost:8090/api/files';
=======
const API_BASE_URL = `${process.env.REACT_APP_SPRING_API_BASE || 'http://localhost:8090'}/api/test/jpa`;
const FILE_API_BASE_URL = `${process.env.REACT_APP_SPRING_API_BASE || 'http://localhost:8090'}/api/files`;
>>>>>>> 3bea2ee84000cc559091f7f22ace329712527bc6

const Test = () => {
    const [tests, setTests] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        name: '',
        description: ''
    });
    const [editingId, setEditingId] = useState(null);
    
    // 이미지 업로드 관련 상태
    const [singleFile, setSingleFile] = useState(null);
    const [multipleFiles, setMultipleFiles] = useState([]);
    const [uploadResult, setUploadResult] = useState(null);
    const [uploadedImages, setUploadedImages] = useState([]);

    // 전체 조회
    const fetchTests = async () => {
        setLoading(true);
        setError('');
        try {
            const response = await axios.get(API_BASE_URL);
            setTests(response.data);
            console.log('조회 성공:', response.data);
        } catch (err) {
            setError('데이터 조회 실패: ' + err.message);
            console.error('조회 에러:', err);
        } finally {
            setLoading(false);
        }
    };

    // 컴포넌트 마운트 시 데이터 조회
    useEffect(() => {
        fetchTests();
    }, []);

    // 폼 데이터 변경 핸들러
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // 생성/수정 처리
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.name.trim()) {
            setError('이름을 입력해주세요.');
            return;
        }

        setLoading(true);
        setError('');

        try {
            if (editingId) {
                // 수정
                await axios.put(`${API_BASE_URL}/${editingId}`, formData);
                console.log('수정 성공');
                setEditingId(null);
            } else {
                // 생성
                await axios.post(API_BASE_URL, formData);
                console.log('생성 성공');
            }

            setFormData({ name: '', description: '' });
            await fetchTests(); // 목록 다시 조회
        } catch (err) {
            setError('저장 실패: ' + err.message);
            console.error('저장 에러:', err);
        } finally {
            setLoading(false);
        }
    };

    // 수정 모드 진입
    const handleEdit = (test) => {
        setFormData({
            name: test.name,
            description: test.address || '' // UserEntity의 address 필드 사용
        });
        setEditingId(test.id);
    };

    // 수정 취소
    const handleCancelEdit = () => {
        setFormData({ name: '', description: '' });
        setEditingId(null);
    };

    // 삭제
    const handleDelete = async (id) => {
        if (!window.confirm('정말 삭제하시겠습니까?')) return;

        setLoading(true);
        setError('');

        try {
            await axios.delete(`${API_BASE_URL}/${id}`);
            console.log('삭제 성공');
            await fetchTests(); // 목록 다시 조회
        } catch (err) {
            setError('삭제 실패: ' + err.message);
            console.error('삭제 에러:', err);
        } finally {
            setLoading(false);
        }
    };

    // 테스트 데이터 초기화
    const handleInitData = async () => {
        if (!window.confirm('기존 데이터를 모두 삭제하고 샘플 데이터로 초기화하시겠습니까?')) return;

        setLoading(true);
        setError('');

        try {
            await axios.post(`${API_BASE_URL}/init`);
            console.log('초기화 성공');
            await fetchTests(); // 목록 다시 조회
        } catch (err) {
            setError('초기화 실패: ' + err.message);
            console.error('초기화 에러:', err);
        } finally {
            setLoading(false);
        }
    };

    // 단일 파일 선택 핸들러
    const handleSingleFileChange = (e) => {
        const file = e.target.files[0];
        setSingleFile(file);
        setUploadResult(null);
    };

    // 다중 파일 선택 핸들러
    const handleMultipleFileChange = (e) => {
        const files = Array.from(e.target.files);
        setMultipleFiles(files);
        setUploadResult(null);
    };

    // 단일 이미지 업로드
    const handleSingleUpload = async () => {
        if (!singleFile) {
            setError('파일을 선택해주세요.');
            return;
        }

        const formData = new FormData();
        formData.append('file', singleFile);
        formData.append('imageTypeCode', '01');
        formData.append('referenceId', 1);

        setLoading(true);
        setError('');

        console.log('formData entries:');
        for (let [key, value] of formData.entries()) {
            console.log(key, value);
        }
        try {
            const response = await axios.post(`${FILE_API_BASE_URL}/upload/single`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            setUploadResult(response.data);
            if (response.data.success) {
                setUploadedImages(prev => [...prev, response.data.filePath]);
            }
            console.log('단일 업로드 성공:', response.data);
        } catch (err) {
            setError('단일 업로드 실패: ' + err.message);
            console.error('단일 업로드 에러:', err);
        } finally {
            setLoading(false);
        }
    };

    // 다중 이미지 업로드
    const handleMultipleUpload = async () => {
        if (multipleFiles.length === 0) {
            setError('파일을 선택해주세요.');
            return;
        }

        const formData = new FormData();
        multipleFiles.forEach(file => {
            formData.append('files', file);
        });
        formData.append('imageTypeCode', '01');
        formData.append('referenceId', 1);
        formData.append('setFirstAsThumbnail', false);

        setLoading(true);
        setError('');

        try {
            const response = await axios.post(`${FILE_API_BASE_URL}/upload/multiple`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            setUploadResult(response.data);
            if (response.data.success) {
                setUploadedImages(prev => [...prev, ...response.data.filePaths]);
            }
            console.log('다중 업로드 성공:', response.data);
        } catch (err) {
            setError('다중 업로드 실패: ' + err.message);
            console.error('다중 업로드 에러:', err);
        } finally {
            setLoading(false);
        }
    };

    // 이미지 삭제
    const handleDeleteImage = async (filePath) => {
        if (!window.confirm('이미지를 삭제하시겠습니까?')) return;

        setLoading(true);
        setError('');

        try {
            const response = await axios.delete(`${FILE_API_BASE_URL}/delete`, {
                params: { filePath }
            });

            if (response.data.success) {
                setUploadedImages(prev => prev.filter(path => path !== filePath));
                console.log('이미지 삭제 성공');
            }
        } catch (err) {
            setError('이미지 삭제 실패: ' + err.message);
            console.error('이미지 삭제 에러:', err);
        } finally {
            setLoading(false);
        }
    };

    // 파일 선택 초기화
    const handleClearFiles = () => {
        setSingleFile(null);
        setMultipleFiles([]);
        setUploadResult(null);
        document.getElementById('singleFile').value = '';
        document.getElementById('multipleFiles').value = '';
    };

    return (
        <div id="test-container">
            <h1>🚀 USER 엔티티 테스트 페이지</h1>

            {error && <div className="error-message">{error}</div>}

            {/* 폼 섹션 */}
            <div className="form-section">
                <h2>{editingId ? '📝 수정하기' : '➕ 새로 추가하기'}</h2>
                <form onSubmit={handleSubmit} className="test-form">
                    <div className="form-group">
                        <label htmlFor="name">사용자 이름:</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            placeholder="사용자 이름을 입력하세요"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="description">주소:</label>
                        <input
                            type="text"
                            id="description"
                            name="description"
                            value={formData.description}
                            onChange={handleInputChange}
                            placeholder="주소를 입력하세요 (선택사항)"
                        />
                    </div>

                    <div className="form-buttons">
                        <button type="submit" disabled={loading} className="btn-primary">
                            {loading ? '처리 중...' : (editingId ? '수정하기' : '추가하기')}
                        </button>
                        {editingId && (
                            <button type="button" onClick={handleCancelEdit} className="btn-secondary">
                                취소
                            </button>
                        )}
                    </div>
                </form>
            </div>

            {/* 🆕 새로운 ImageUtil 컴포넌트 테스트 */}
            <div className="form-section">
                <h2>🆕 ImageUtil 컴포넌트 테스트</h2>

                {/* 이미지 슬라이더 테스트 */}
                <div className="upload-section">
                    <h3>3. 이미지 슬라이더 컴포넌트</h3>
                    <p>📝 테스트용 샘플 이미지들을 슬라이드로 표시:</p>
                    <ImageSlider
                        images={[
                            { filePath: 'https://picsum.photos/400/300?random=1', alt: '샘플 이미지 1' },
                            { filePath: 'https://picsum.photos/400/300?random=2', alt: '샘플 이미지 2' },
                            { filePath: 'https://picsum.photos/400/300?random=3', alt: '샘플 이미지 3' },
                        ]}
                        showDots={true}
                        showArrows={true}
                        autoSlide={true}
                        slideInterval={4000}
                        onImageClick={(image, index) => {
                            console.log('이미지 클릭:', image, index);
                            alert(`${index + 1}번째 이미지 클릭됨`);
                        }}
                        className="test-slider"
                    />
                </div>

                {/* 통합 업로드/뷰어 컴포넌트 */}
                <div className="upload-section">
                    <h3>4. 통합 업로드/뷰어 컴포넌트 (단일 모드)</h3>
                    <p>📝 이미지가 없으면 업로드 영역, 있으면 이미지 표시 + 변경 버튼:</p>
                    <ImageUploadViewer
                        imageTypeCode="03"
                        referenceId={3}
                        mode="single"
                        onUploadSuccess={(result) => {
                            console.log('통합 단일 업로드 성공:', result);
                            alert('단일 이미지 업로드 성공!');
                        }}
                        onUploadError={(error) => {
                            console.error('통합 단일 업로드 실패:', error);
                            alert(`업로드 실패: ${error}`);
                        }}
                        onViewError={(error) => {
                            console.error('이미지 조회 실패:', error);
                        }}
                        emptyPlaceholder="프로필 이미지를 업로드하려면 클릭하세요"
                        className="test-upload-viewer"
                    />
                </div>

                <div className="upload-section">
                    <h3>5. 통합 업로드/뷰어 컴포넌트 (다중 모드)</h3>
                    <p>📝 이미지들을 슬라이드로 보여주며 추가 업로드 가능:</p>
                    <ImageUploadViewer
                        imageTypeCode="04"
                        referenceId={4}
                        mode="multiple"
                        maxFiles={8}
                        onUploadSuccess={(result) => {
                            console.log('통합 다중 업로드 성공:', result);
                            alert(`다중 이미지 업로드 성공! ${result.uploadCount}개 파일`);
                        }}
                        onUploadError={(error) => {
                            console.error('통합 다중 업로드 실패:', error);
                            alert(`업로드 실패: ${error}`);
                        }}
                        onViewError={(error) => {
                            console.error('이미지 조회 실패:', error);
                        }}
                        emptyPlaceholder="펫 사진들을 업로드하려면 클릭하세요"
                        className="test-upload-viewer"
                    />
                </div>

                {/* 조회 기능 테스트 */}
                <div className="upload-section">
                    <h3>6. 이미지 조회 기능 테스트</h3>
                    <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
                        <button
                            className="btn-secondary"
                            onClick={async () => {
                                try {
                                    const result = await fetchImagesByReference('01', 1);
                                    console.log('다중 조회 결과:', result);
                                    alert(`조회 성공: ${result.data?.length || 0}개 이미지`);
                                } catch (error) {
                                    console.error('조회 실패:', error);
                                    alert('조회 실패: ' + error.message);
                                }
                            }}
                        >
                            📄 참조 기준 다중 조회 (타입:01, 참조ID:1)
                        </button>
                        <button
                            className="btn-secondary"
                            onClick={async () => {
                                try {
                                    const result = await fetchSingleImage('uploads/sample.jpg');
                                    console.log('단일 조회 결과:', result);
                                    alert('단일 조회 성공');
                                } catch (error) {
                                    console.error('단일 조회 실패:', error);
                                    alert('단일 조회 실패: ' + error.message);
                                }
                            }}
                        >
                            🖼️ 단일 이미지 조회 테스트
                        </button>
                    </div>
                    <p><small>💡 브라우저 콘솔에서 결과를 확인하세요.</small></p>
                </div>
            </div>

            {/* 🔧 기존 이미지 업로드 섹션 (디버깅용) */}
            <div className="form-section">
                <h2>📷 기존 이미지 업로드 테스트</h2>
                
                {/* 단일 이미지 업로드 */}
                <div className="upload-section">
                    <h3>단일 이미지 업로드</h3>
                    <div className="form-group">
                        <label htmlFor="singleFile">이미지 선택:</label>
                        <input
                            type="file"
                            id="singleFile"
                            accept="image/*"
                            onChange={handleSingleFileChange}
                        />
                        {singleFile && (
                            <p className="file-info">선택된 파일: {singleFile.name} ({(singleFile.size / 1024).toFixed(1)}KB)</p>
                        )}
                    </div>
                    <button 
                        onClick={handleSingleUpload} 
                        disabled={loading || !singleFile}
                        className="btn-primary"
                    >
                        {loading ? '업로드 중...' : '단일 업로드'}
                    </button>
                </div>

                {/* 다중 이미지 업로드 */}
                <div className="upload-section">
                    <h3>다중 이미지 업로드</h3>
                    <div className="form-group">
                        <label htmlFor="multipleFiles">이미지들 선택:</label>
                        <input
                            type="file"
                            id="multipleFiles"
                            accept="image/*"
                            multiple
                            onChange={handleMultipleFileChange}
                        />
                        {multipleFiles.length > 0 && (
                            <div className="file-info">
                                <p>선택된 파일 {multipleFiles.length}개:</p>
                                <ul>
                                    {multipleFiles.map((file, index) => (
                                        <li key={index}>{file.name} ({(file.size / 1024).toFixed(1)}KB)</li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                    <button 
                        onClick={handleMultipleUpload} 
                        disabled={loading || multipleFiles.length === 0}
                        className="btn-primary"
                    >
                        {loading ? '업로드 중...' : `다중 업로드 (${multipleFiles.length}개)`}
                    </button>
                </div>

                {/* 파일 선택 초기화 */}
                <button onClick={handleClearFiles} className="btn-secondary">
                    🗑️ 파일 선택 초기화
                </button>

                {/* 업로드 결과 */}
                {uploadResult && (
                    <div className={`upload-result ${uploadResult.success ? 'success' : 'error'}`}>
                        <h4>업로드 결과:</h4>
                        <p><strong>상태:</strong> {uploadResult.success ? '성공' : '실패'}</p>
                        <p><strong>메시지:</strong> {uploadResult.message}</p>
                        {uploadResult.filePath && (
                            <p><strong>파일 경로:</strong> {uploadResult.filePath}</p>
                        )}
                        {uploadResult.filePaths && (
                            <div>
                                <p><strong>업로드된 파일들 ({uploadResult.uploadCount}개):</strong></p>
                                <ul>
                                    {uploadResult.filePaths.map((path, index) => (
                                        <li key={index}>{path}</li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* 업로드된 이미지 목록 */}
            {uploadedImages.length > 0 && (
                <div className="form-section">
                    <h2>📁 업로드된 이미지 목록 ({uploadedImages.length}개)</h2>
                    <div className="uploaded-images">
                        {uploadedImages.map((imagePath, index) => (
                            <div key={index} className="uploaded-image-item">
                                <div className="image-info">
                                    <p><strong>경로:</strong> {imagePath}</p>
                                    <img 
<<<<<<< HEAD
                                        src={`http://localhost:8090/${imagePath}`} 
=======
                                        src={`${process.env.REACT_APP_SPRING_API_BASE || 'http://localhost:8090'}/${imagePath}`} 
>>>>>>> 3bea2ee84000cc559091f7f22ace329712527bc6
                                        alt={`Uploaded ${index + 1}`}
                                        style={{ maxWidth: '200px', maxHeight: '150px', objectFit: 'cover' }}
                                        onError={(e) => {
                                            e.target.style.display = 'none';
                                            e.target.nextSibling.style.display = 'block';
                                        }}
                                    />
                                    <div style={{ display: 'none', color: 'red' }}>이미지 로드 실패</div>
                                </div>
                                <button 
                                    onClick={() => handleDeleteImage(imagePath)}
                                    className="btn-delete"
                                    disabled={loading}
                                >
                                    🗑️ 삭제
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* 컨트롤 버튼들 */}
            <div className="control-section">
                <button onClick={fetchTests} disabled={loading} className="btn-refresh">
                    🔄 새로고침
                </button>
                <button onClick={handleInitData} disabled={loading} className="btn-init">
                    🔧 샘플 데이터 초기화
                </button>
            </div>

            {/* 데이터 목록 */}
            <div className="data-section">
                <h2>📋 USER 테이블 데이터 ({tests.length}개)</h2>

                {loading && <div className="loading">로딩 중...</div>}

                {tests.length === 0 && !loading ? (
                    <div className="no-data">데이터가 없습니다. 위에서 데이터를 추가하거나 샘플 데이터를 초기화해보세요.</div>
                ) : (
                    <div className="test-list">
                        {tests.map((test) => (
                            <div key={test.id} className="test-item">
                                <div className="test-info">
                                    <h3>👤 {test.name}</h3>
                                    <p><strong>ID:</strong> {test.id}</p>
                                    <p><strong>이메일:</strong> {test.email}</p>
                                    <p><strong>닉네임:</strong> {test.nickName}</p>
                                    <p><strong>주소:</strong> {test.address}</p>
                                    <p><strong>휴대폰:</strong> {test.phone}</p>
                                    <p><strong>성별:</strong> {test.gender}</p>
                                    <p><strong>역할:</strong> {test.role}</p>
                                    <p><strong>제공자:</strong> {test.provider}</p>
                                    <p><strong>상태:</strong> {test.status}</p>
                                    <p><strong>이메일 인증:</strong> {test.emailVerified === 'Y' ? '인증됨' : '미인증'}</p>
                                    <p><strong>생성일:</strong> {new Date(test.createdAt).toLocaleString()}</p>
                                    <p><strong>수정일:</strong> {new Date(test.updatedAt).toLocaleString()}</p>
                                </div>
                                <div className="test-actions">
                                    <button
                                        onClick={() => handleEdit(test)}
                                        className="btn-edit"
                                        disabled={loading}
                                    >
                                        ✏️ 수정
                                    </button>
                                    <button
                                        onClick={() => handleDelete(test.id)}
                                        className="btn-delete"
                                        disabled={loading}
                                    >
                                        🗑️ 삭제
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Test;