import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./CompanyManagePage.css";
import { Plus, MapPin, Phone, Clock, Edit, Trash2 } from "lucide-react";
import { getMyCompanies, deleteCompany } from "../../services/companyService";

function CompanyManagePage() {
    const navigate = useNavigate();
    const [companies, setCompanies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // 업체 목록 로드
    useEffect(() => {
        const loadCompanies = async () => {
            try {
                const data = await getMyCompanies();
                setCompanies(data);
                setError(null);
            } catch (err) {
                console.error('업체 목록 로드 오류:', err);
                setError('업체 목록을 불러오는 중 오류가 발생했습니다.');
            } finally {
                setLoading(false);
            }
        };

        loadCompanies();
    }, []);

    // 업체 타입 표시용
    const getCompanyTypeDisplay = (type) => {
        switch(type) {
            case 'P': return '개인(일반인)';
            case 'B': return '개인/법인사업자';
            default: return type;
        }
    };

    // 업체 상태 표시용
    const getCompanyStatusDisplay = (status) => {
        switch(status) {
            case 'P': return '승인대기';
            case 'A': return '승인완료';
            case 'R': return '승인거절';
            default: return status;
        }
    };

    // 서비스 목록 파싱
    const parseServices = (servicesJson) => {
        try {
            if (!servicesJson) return [];
            const services = JSON.parse(servicesJson);
            return Object.entries(services)
                .filter(([key, value]) => key !== '전체' && value === true)
                .map(([key]) => key);
        } catch (e) {
            console.error('서비스 정보 파싱 오류:', e);
            return [];
        }
    };

    // 운영시간 파싱
    const parseOperatingHours = (operatingHoursJson) => {
        try {
            if (!operatingHoursJson) return '정보 없음';
            const operatingData = JSON.parse(operatingHoursJson);

            if (operatingData.allDay) {
                return '24시간 운영';
            }

            // 첫 번째 비휴무 요일의 시간을 표시
            const schedule = operatingData.schedule || {};
            const firstOpenDay = Object.values(schedule).find(day => !day.closed);

            if (firstOpenDay) {
                return `${firstOpenDay.open} - ${firstOpenDay.close}`;
            }

            return '정보 없음';
        } catch (e) {
            console.error('운영시간 정보 파싱 오류:', e);
            return '정보 없음';
        }
    };

    // 업체 등록 페이지로 이동
    const handleAddCompany = () => {
        navigate('/companyregister');
    };

    // 업체 수정 페이지로 이동
    const handleEditCompany = (companyId) => {
        navigate(`/companyedit/${companyId}`);
    };

    // 업체 삭제
    const handleDeleteCompany = async (companyId, companyName) => {
        if (window.confirm(`정말로 "${companyName}" 업체를 삭제하시겠습니까?\n삭제된 업체는 복구할 수 없습니다.`)) {
            try {
                await deleteCompany(companyId);
                // 목록에서 삭제된 업체 제거
                setCompanies(prevCompanies =>
                    prevCompanies.filter(company => company.id !== companyId)
                );
                alert('업체가 삭제되었습니다.');
            } catch (error) {
                console.error('업체 삭제 오류:', error);
                alert('업체 삭제 중 오류가 발생했습니다. 다시 시도해주세요.');
            }
        }
    };

    if (loading) {
        return <div className="loading">로딩 중...</div>;
    }

    if (error) {
        return (
            <div className="error-message">
                <p>{error}</p>
                <button onClick={() => window.location.reload()}>다시 시도</button>
            </div>
        );
    }

    return(
        <div className="company_manage_page">
            <div className="company_manage_main">
                {/* 헤더 섹션 */}
                <div className="section-header">
                    <div className="header_info">
                        <h2 className="section-title">업체 목록</h2>
                        <p className="section-subtitle">펫케어 업체 정보를 관리하세요</p>
                    </div>
                    <button className="add-button" onClick={handleAddCompany}>
                        <Plus size={16} />
                        업체 등록
                    </button>
                </div>

                {/* 등록된 업체 섹션 */}
                <div className="company_manage_section">
                    <div className="companies_section">
                        <h3>등록된 업체 ({companies.length}개)</h3>
                        {companies.length === 0 ? (
                            <div className="empty_state">
                                <p>등록된 업체가 없습니다.</p>
                                <button className="add-button" onClick={handleAddCompany}>
                                    <Plus size={16} />
                                    첫 업체 등록하기
                                </button>
                            </div>
                        ) : (
                            <div className="company_list">
                                {companies.map(company => {
                                    const services = parseServices(company.services);
                                    const operatingHours = parseOperatingHours(company.operatingHours);
                                    const fullAddress = `${company.roadAddr}${company.detailAddr ? ' ' + company.detailAddr : ''}`;

                                    return (
                                        <div key={company.id} className="company_card">
                                            <div className="company_card_content">
                                                <div className="company_info">
                                                    <div className="company_header">
                                                        <div className="company_name_type">
                                                            <h4 className="company_name">{company.name}</h4>
                                                            <span className="company_type">{getCompanyTypeDisplay(company.type)}</span>
                                                            <span className={`status_badge ${company.status === 'A' ? 'active' : 'inactive'}`}>
                                                                {getCompanyStatusDisplay(company.status)}
                                                            </span>
                                                        </div>
                                                    </div>

                                                    <div className="company_details">
                                                        <div className="detail_item">
                                                            <MapPin size={16} />
                                                            <span>{fullAddress}</span>
                                                        </div>
                                                        <div className="detail_item">
                                                            <Phone size={16} />
                                                            <span>{company.tel}</span>
                                                        </div>
                                                        <div className="detail_item">
                                                            <Clock size={16} />
                                                            <span>{operatingHours}</span>
                                                        </div>
                                                    </div>

                                                    <div className="services_list">
                                                        {services.length > 0 ? (
                                                            services.map((service, index) => (
                                                                <span key={index} className="service_tag">{service}</span>
                                                            ))
                                                        ) : (
                                                            <span className="service_tag">서비스 정보 없음</span>
                                                        )}
                                                    </div>

                                                    {company.descText && (
                                                        <div className="company_description">
                                                            <p>{company.descText}</p>
                                                        </div>
                                                    )}
                                                </div>

                                                <div className="company_actions">
                                                    <button
                                                        className="action_btn edit_btn"
                                                        onClick={() => handleEditCompany(company.id)}
                                                        title="수정"
                                                    >
                                                        <Edit size={16} />
                                                    </button>
                                                    <button
                                                        className="action_btn delete_btn"
                                                        onClick={() => handleDeleteCompany(company.id, company.name)}
                                                        title="삭제"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>

                </div>
            </div>
        </div>
    );
}

export default CompanyManagePage;