import { getValueAsType, getValueTransition } from "framer-motion";
import { Plus } from "lucide-react";
import React, { useState } from "react";
import "./CompanyRegisterPage.css";

function CompanyRegisterPage() {

    const [companyType, setCompanyType] = useState("INDIVIDUAL");
    const [files, setFiles] = useState([]);

    const handleFiles = (newFiles) => {
        const fileArray = Array.from(newFiles);
        setFiles((prev) => [...prev, ...fileArray]);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        handleFiles(e.dataTransfer.files);
    };

    return(
        <div className="company_register_page">
            <div className="company_register_main">
                <div className="company_register_content">
                    {/* 헤더 섹션 */}
                    <div className="section-header">
                        <div className="header_info">
                        <h2 className="section-title">업체 등록</h2>
                        <p className="section-subtitle">펫케어 업체 정보를 등록하세요</p>
                        </div>
                    </div>

                    {/* 업체 구분 */}
                    <div className="company_register_section">
                        <h3>업체 구분</h3>
                        <div className="radio_group">
                            <label className="radio_item">
                            <input
                                type="radio"
                                name="company_type"
                                value="INDIVIDUAL"
                                checked={companyType === "INDIVIDUAL"}
                                onChange={(e) => setCompanyType(e.target.value)}
                            />
                            <span>개인사업자</span>
                        </label>

                        <label className="radio_item">
                            <input
                                type="radio"
                                name="company_type"
                                value="CORPORATION"
                                checked={companyType === "CORPORATION"}
                                onChange={(e) => setCompanyType(e.target.value)}
                            />
                            <span>법인사업자</span>
                        </label>
                        </div>
                        
                        {/* 사업자 정보 */}
                        <div className="company_form_grid">
                            {companyType === "INDIVIDUAL" 
                            ?
                                (
                                    <>
                                        <div className="company_form_group">
                                            <span>주민등록번호</span>
                                            <div className="ssn_input_group">
                                                <input 
                                                    type="text"
                                                    className="form_input"
                                                    placeholder="123456"
                                                />
                                                -
                                                <input 
                                                    type="password"
                                                    className="form_input"
                                                    placeholder="1234567"
                                                />
                                            </div>
                                        </div>
                                        <div className="company_form_group">
                                            <span>성함</span>
                                            <input 
                                                type="text"
                                                className="form_input"
                                                placeholder="홍길동"
                                            />
                                        </div>
                                    </>
                                )
                                
                            :
                                (
                                    <div className="company_form_group">
                                            <span>사업자등록번호</span>
                                            <div className="input_button_group">
                                                <input 
                                                    type="text"
                                                    className="form_input"
                                                    placeholder="123-45-67890"
                                                />
                                                <button type="button" className="search_btn">
                                                    사업장 조회
                                                </button>
                                            </div>       
                                    </div>
                                )
                        }
                        </div>
                        
                        {/* 주소 정보 */}
                        <div className="company_form_grid">
                            <div className="company_form_group">
                                <span>주소</span>
                                <div className="input_button_group">
                                    <input 
                                        type="text"
                                        className="form_input"
                                        placeholder="도로명 주소를 검색해주세요"
                                        readOnly
                                    />
                                    <button type="button" className="search_btn">
                                        주소 검색
                                    </button>
                                </div>
                            </div>
                            <div className="company_form_group">
                                <span>상세주소</span>
                                <input 
                                    type="text"
                                    className="form_input"
                                    placeholder="상세 주소를 입력해주세요"
                                />
                            </div>
                        </div>

                        {/* 대표 서비스 & 연락처 */}
                        <div className="company_form_grid">
                            <div className="company_form_group">
                                <span>대표 서비스</span>
                                <select className="form_select">
                                    <option value="">선택해주세요</option>
                                    <option value="돌봄">돌봄</option>
                                    <option value="산책">산책</option>
                                    <option value="미용">미용</option>
                                    <option value="병원">병원</option>
                                    <option value="기타">기타</option>
                                </select>
                            </div>
                            <div className="company_form_group">
                                <span>연락처</span>
                                <div className="tel_input_group">
                                    <input 
                                        type="tel"
                                        className="tel_form_input"
                                        maxLength={3}
                                    />
                                    -
                                    <input 
                                        type="tel"
                                        className="tel_form_input"
                                        maxLength={4}
                                    />
                                    -
                                    <input 
                                        type="tel"
                                        className="tel_form_input"
                                        maxLength={4}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* 제공 서비스 */}
                        <div className="company_form_section">
                            <span>제공 서비스</span>
                            <div className="company_checkbox_group">
                                <label><input type="checkbox"/> 돌봄</label>
                                <label><input type="checkbox"/> 산책</label>
                                <label><input type="checkbox"/> 미용</label>
                                <label><input type="checkbox"/> 병원</label>
                                <label><input type="checkbox"/> 기타</label>
                            </div>
                        </div>

                        {/* 운영 시간 */}
                        <div className="company_form_section">
                                <span>운영시간</span>
                                <label><input type="checkbox"/> 24시간 운영</label>
                                <div>
                                    월요일
                                    <input type="time"/> ~ <input type="time"/>
                                    <label><input type="checkbox"/> 휴무</label>
                                </div>
                                <div>
                                    화요일
                                    <input type="time"/> ~ <input type="time"/>
                                    <label><input type="checkbox"/> 휴무</label>
                                </div>
                                <div>
                                    수요일
                                    <input type="time"/> ~ <input type="time"/>
                                    <label><input type="checkbox"/> 휴무</label>
                                </div>
                                <div>
                                    목요일
                                    <input type="time"/> ~ <input type="time"/>
                                    <label><input type="checkbox"/> 휴무</label>
                                </div>
                                <div>
                                    금요일
                                    <input type="time"/> ~ <input type="time"/>
                                    <label><input type="checkbox"/> 휴무</label>
                                </div>
                                <div>
                                    토요일
                                    <input type="time"/> ~ <input type="time"/>
                                    <label><input type="checkbox"/> 휴무</label>
                                </div>
                                <div>
                                    일요일
                                    <input type="time"/> ~ <input type="time"/>
                                    <label><input type="checkbox"/> 휴무</label>
                                </div>
                        </div>

                        {/* 업체 사진 */}
                        <div className="company_form_section">
                            <span>업체 사진</span>
                            <div
                                className="file_upload_area"
                                onDragOver={(e) => e.preventDefault()}
                                onDrop={handleDrop}
                            >
                                <div className="upload_content">
                                    <div className="upload_icon">📁</div>
                                    <p>여기에 사진을 드래그하거나 클릭해서 업로드하세요</p>
                                    <input 
                                    type="file"
                                    accept="image/*"
                                    multiple
                                    />
                                </div>
                                
                            </div>
                        </div>

                        {/* 업체 소개 */}
                        <div className="company_form_section">
                            <span>업체 소개</span>
                                <textarea 
                                    className="company_form_textarea"
                                    placeholder="업체 소개글을 작성해주세요"
                                    rows={4}
                                />                           
                        </div>
                        
                        {/* 버튼 영역 */}
                        <div className="company_form_btn">
                            <button type="button" className="cancel_btn">취소</button>
                            <button type="submit" className="submit_btn">등록</button>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
}

export default CompanyRegisterPage;