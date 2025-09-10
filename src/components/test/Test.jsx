import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Test.css';

const API_BASE_URL = 'http://localhost:8090/api/test/jpa';

const Test = () => {
    const [tests, setTests] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        name: '',
        description: ''
    });
    const [editingId, setEditingId] = useState(null);

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