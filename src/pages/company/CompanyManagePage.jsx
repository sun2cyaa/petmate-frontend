import React from "react";
import "./CompanyManagePage.css";
import { Plus, MapPin, Phone, Clock, Edit, Trash2 } from "lucide-react";

function CompanyManagePage() {
    // 더미 데이터
    const dummyCompanies = [
        {
            id: 1,
            name: "해피펫 케어센터",
            type: "개인사업자",
            address: "서울시 강남구 테헤란로 123",
            phone: "010-1234-5678",
            services: ["돌봄", "산책", "미용"],
            operatingHours: "09:00 - 18:00",
            status: "운영중"
        },
        {
            id: 2,
            name: "러블리독 호텔",
            type: "법인사업자", 
            address: "서울시 서초구 강남대로 456",
            phone: "02-987-6543",
            services: ["돌봄", "병원"],
            operatingHours: "24시간",
            status: "운영중"
        },
        {
            id: 3,
            name: "펫프렌즈",
            type: "개인사업자",
            address: "서울시 마포구 홍대로 789",
            phone: "010-9876-5432", 
            services: ["산책", "미용", "기타"],
            operatingHours: "10:00 - 20:00",
            status: "휴무"
        }
    ];

    return(
        <div className="company_manage_page">
            <div className="company_manage_main">
                <div className="company_manage_content">
                    {/* 헤더 섹션 */}
                    <div className="section-header">
                        <div className="header_info">
                            <h2 className="section-title">업체 목록</h2>
                            <p className="section-subtitle">펫케어 업체 정보를 관리하세요</p>
                        </div>
                        <button className="add-button">
                            <Plus size={16} />
                            업체 등록
                        </button>
                    </div>

                    {/* 등록된 업체 */}
                    <div className="companies_section">
                        <h3>등록된 업체 ({dummyCompanies.length}개)</h3>
                        <div className="company_list">
                            {dummyCompanies.map(company => (
                                <div key={company.id} className="company_card">
                                    <div className="company_card_content">
                                        <div className="company_info">
                                            <div className="company_header">
                                                <div className="company_name_type">
                                                    <h4 className="company_name">{company.name}</h4>
                                                    <span className="company_type">{company.type}</span>
                                                    <span className={`status_badge ${company.status === '운영중' ? 'active' : 'inactive'}`}>
                                                        {company.status}
                                                    </span>
                                                </div>
                                            </div>
                                            
                                            <div className="company_details">
                                                <div className="detail_item">
                                                    <MapPin size={16} />
                                                    <span>{company.address}</span>
                                                </div>
                                                <div className="detail_item">
                                                    <Phone size={16} />
                                                    <span>{company.phone}</span>
                                                </div>
                                                <div className="detail_item">
                                                    <Clock size={16} />
                                                    <span>{company.operatingHours}</span>
                                                </div>
                                            </div>
                                            
                                            <div className="services_list">
                                                {company.services.map((service, index) => (
                                                    <span key={index} className="service_tag">{service}</span>
                                                ))}
                                            </div>
                                        </div>
                                        
                                        <div className="company_actions">
                                            <button className="action_btn edit_btn">
                                                <Edit size={16} />
                                            </button>
                                            <button className="action_btn delete_btn">
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}

export default CompanyManagePage;