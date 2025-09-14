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

    // 업체명 또는 성함 표시용 (타입에 따라)
    const getDisplayName = (company) => {
        if (company.type === 'P') {
            // 개인(일반인): 성함 표시
            return company.personalName || company.repName || company.name || '이름 없음';
        } else {
            // 개인/법인사업자: 상호명
            return company.name || '상호명 없음';
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

    // 서비스 목록 파싱 (대표 서비스 우선 배치)
    const parseServices = (servicesJson, repService) => {
        try {
            if (!servicesJson) return [];
            const services = JSON.parse(servicesJson);
            const serviceList = Object.entries(services)
                .filter(([key, value]) => key !== '전체' && value === true)
                .map(([key]) => key);
            
            // 대표 서비스 코드를 한글명으로 변환
            const getServiceName = (code) => {
                const serviceMapping = {
                    '1': '돌봄',
                    '2': '산책', 
                    '3': '미용',
                    '4': '병원',
                    '9': '기타'
                };
                return serviceMapping[code] || code;
            };
            
            const mainServiceName = getServiceName(repService);
            
            // 대표 서비스를 맨 앞으로, 나머지는 뒤에 배치
            const mainServices = serviceList.filter(service => service === mainServiceName);
            const otherServices = serviceList.filter(service => service !== mainServiceName);
            
            return [...mainServices, ...otherServices];
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

    // 휴무일 파싱
    const parseClosedDays = (operatingHoursJson) => {
        try {
            if (!operatingHoursJson) return [];
            const operatingData = JSON.parse(operatingHoursJson);

            if (operatingData.allDay) {
                return []; // 24시간 운영이면 휴무 없음
            }

            const schedule = operatingData.schedule || {};
            const closedDays = [];
            
            // 요일 순서대로 정렬하기 위한 매핑
            const dayOrder = ['월요일', '화요일', '수요일', '목요일', '금요일', '토요일', '일요일'];
            const dayMapping = {
                '월요일': '월',
                '화요일': '화',
                '수요일': '수',
                '목요일': '목',
                '금요일': '금',
                '토요일': '토',
                '일요일': '일'
            };

            // 요일 순서대로 확인하여 휴무일 추가
            dayOrder.forEach(day => {
                if (schedule[day] && schedule[day].closed) {
                    closedDays.push(dayMapping[day]);
                }
            });

            return closedDays;
        } catch (e) {
            console.error('휴무일 정보 파싱 오류:', e);
            return [];
        }
    };

    // 대표 서비스인지 확인하는 함수
    const isMainService = (serviceName, repService) => {
        const serviceMapping = {
            '1': '돌봄',
            '2': '산책', 
            '3': '미용',
            '4': '병원',
            '9': '기타'
        };
        const mainServiceName = serviceMapping[repService] || repService;
        return serviceName === mainServiceName;
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
                            </div>
                        ) : (
                            <div className="company_list">
                                {companies.map(company => {
                                    const services = parseServices(company.services, company.repService);
                                    const operatingHours = parseOperatingHours(company.operatingHours);
                                    const closedDays = parseClosedDays(company.operatingHours);
                                    const fullAddress = `${company.roadAddr}${company.detailAddr ? ' ' + company.detailAddr : ''}`;
                                    const displayName = getDisplayName(company);

                                    return (
                                        <div key={company.id} className="company_card">
                                            <div className="company_card_content">
                                                <div className="company_info">
                                                    <div className="company_header">
                                                        <div className="company_name_type">
                                                            <h4 className="company_name">{displayName}</h4>
                                                            <span className="company_type">{getCompanyTypeDisplay(company.type)}</span>
                                                            <span className={`status_badge ${company.status === 'A' ? 'active' : 'inactive'}`}>
                                                                {getCompanyStatusDisplay(company.status)}
                                                            </span>
                                                        </div>
                                                        {/* 타입별 추가 정보 표시 */}
                                                        <div className="company_sub_info">
                                                            {company.type === 'P' && company.personalName && (
                                                                <span className="sub_info_text">성함: {company.personalName}</span>
                                                            )}
                                                            {company.type === 'B' && company.repName && (
                                                                <span className="sub_info_text">대표자: {company.repName}</span>
                                                            )}
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
                                                        {/* 휴무일 정보 추가 */}
                                                        {closedDays.length > 0 && (
                                                            <div className="detail_item">
                                                                <span className="closed_days_label">휴무:</span>
                                                                <span className="closed_days">{closedDays.join(', ')}</span>
                                                            </div>
                                                        )}
                                                    </div>

                                                    <div className="services_list">
                                                        {services.length > 0 ? (
                                                            services.map((service, index) => (
                                                                <span 
                                                                    key={index} 
                                                                    className={`service_tag ${isMainService(service, company.repService) ? 'main_service' : ''}`}
                                                                >
                                                                    {service}
                                                                </span>
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