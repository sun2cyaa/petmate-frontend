import React, { useEffect, useState } from "react";
import "./ProductRegisterPage.css";
import { useNavigate } from "react-router-dom";
import {
  createProduct,
  getCompanies,
  getServiceCategories,
} from "../../services/product/productService";
import { createProductSlots } from "../../services/product/availabilitySlotService";

// lucide-react 아이콘
import {
  Building2, Tags, Package, ClipboardList, CreditCard, Clock,
  Dog, Users, CalendarCheck, ToggleRight, Sun, PawPrint
} from "lucide-react";

const ProductRegisterPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [companies, setCompanies] = useState([]);
  const [serviceCategories, setServiceCategories] = useState([]);

  const [formData, setFormData] = useState({
    companyId: "",
    serviceTypeId: "",
    name: "",
    description: "",
    price: "",
    duration: "",
    minPet: "1",
    maxPet: "1",
    isAllDay: false,
    isActive: true,
  });

  const [errors, setErrors] = useState({});
  const [slotSettings, setSlotSettings] = useState({
    startDate: "",
    endDate: "",
    selectedTimes: [],
    capacity: 1,
  });

  const generateTimeSlots = () => {
    const slots = [];
    for (let hour = 9; hour <= 18; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const startTime = `${hour.toString().padStart(2, "0")}:${minute
          .toString()
          .padStart(2, "0")}`;
        const endHour = minute === 30 ? hour + 1 : hour;
        const endMinute = minute === 30 ? 0 : 30;
        const endTime = `${endHour.toString().padStart(2, "0")}:${endMinute
          .toString()
          .padStart(2, "0")}`;
        slots.push(`${startTime}-${endTime}`);
      }
    }
    return slots;
  };

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      setLoading(true);
      const [companiesData, categoriesData] = await Promise.all([
        getCompanies(),
        getServiceCategories(),
      ]);
      setCompanies(companiesData);
      setServiceCategories(categoriesData);
    } catch (error) {
      console.error("데이터 로드 실패", error);
      alert("데이터를 불러오는데 실패하였습니다.");
      navigate("/product");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.companyId) newErrors.companyId = "업체를 선택해주세요.";
    if (!formData.serviceTypeId) newErrors.serviceTypeId = "서비스 유형을 선택해주세요.";
    if (!formData.name.trim()) newErrors.name = "상품명을 입력해주세요.";
    if (!formData.description.trim()) newErrors.description = "상품 설명을 입력해주세요.";
    if (!formData.price || formData.price <= 0) newErrors.price = "올바른 가격을 입력해주세요.";
    if (!formData.duration || formData.duration <= 0) newErrors.duration = "올바른 소요시간을 입력해주세요.";
    if (!formData.minPet || formData.minPet <= 0) newErrors.minPet = "최소 펫 수를 입력해주세요.";
    if (!formData.maxPet || formData.maxPet <= 0) newErrors.maxPet = "최대 펫 수를 입력해주세요.";
    if (parseInt(formData.minPet) > parseInt(formData.maxPet)) newErrors.maxPet = "최대 펫 수는 최소 펫 수보다 커야 합니다.";
    if (slotSettings.selectedTimes.length > 0) {
      if (!slotSettings.startDate) newErrors.startDate = "시작 날짜를 선택해주세요.";
      if (!slotSettings.endDate) newErrors.endDate = "종료 날짜를 선택해주세요.";
      if (slotSettings.capacity <= 0) newErrors.capacity = "수용 인원을 입력해주세요.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    try {
      setSaving(true);
      const createdProduct = await createProduct({
        ...formData,
        price: Number(formData.price),
        duration: Number(formData.duration),
        minPet: Number(formData.minPet),
        maxPet: Number(formData.maxPet),
        companyId: Number(formData.companyId),
      });
      if (slotSettings.selectedTimes.length > 0) {
        const timeSlots = slotSettings.selectedTimes.map((timeRange) => {
          const [startTime, endTime] = timeRange.split("-");
          return { startTime, endTime };
        });
        await createProductSlots(createdProduct.id, formData.companyId, {
          startDate: slotSettings.startDate,
          endDate: slotSettings.endDate,
          timeSlots,
          capacity: slotSettings.capacity,
        });
      }
      alert("상품과 시간 슬롯이 성공적으로 등록되었습니다.");
      navigate("/product");
    } catch (error) {
      console.error("등록 실패:", error);
      alert("등록에 실패했습니다.");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    if (window.confirm("등록을 취소하시겠습니까?")) navigate("/product");
  };

  const handleReset = () => {
    if (window.confirm("초기화하시겠습니까?")) {
      setFormData({ companyId:"", serviceTypeId:"", name:"", description:"", price:"", duration:"", minPet:"1", maxPet:"1", isAllDay:false, isActive:true });
      setErrors({});
    }
  };

  const handleAllDayChange = (e) => {
    const isAllDay = e.target.checked;
    if (isAllDay) {
      const today = new Date();
      const nextMonth = new Date(today);
      nextMonth.setDate(today.getDate() + 30);
      const startDate = today.toISOString().split("T")[0];
      const endDate = nextMonth.toISOString().split("T")[0];
      setSlotSettings({ startDate, endDate, selectedTimes:["09:00-18:00"], capacity:1 });
      alert("종일 상품으로 설정되어 30일 기간이 자동 선택되었습니다.");
    } else {
      setSlotSettings({ startDate:"", endDate:"", selectedTimes:[], capacity:1 });
    }
    setFormData((prev) => ({ ...prev, isAllDay }));
  };

  if (loading) return <div className="product-manage_wrap"><div style={{textAlign:"center",padding:"40px"}}>로딩 중...</div></div>;

  return (
    <div className="product-manage_wrap">
      <div className="product-header">
        <h2><Package className="icon-title"/> &nbsp; 상품 등록</h2>
        <p>새로운 서비스 상품을 등록하세요</p>
      </div>

      <form onSubmit={handleSubmit} className="product-form">
        {/* 업체 & 서비스 유형 */}
        <div className="form-section">
          <div className="form-row">
            <div className="form-field">
              <label><Building2 className="icon"/> 업체 선택 *</label>
              <select name="companyId" value={formData.companyId} onChange={handleInputChange}>
                <option value="">업체를 선택하세요</option>
                {companies.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
              {errors.companyId && <span className="error-message">{errors.companyId}</span>}
            </div>
            <div className="form-field">
              <label><Tags className="icon"/> 서비스 유형</label>
              <select name="serviceTypeId" value={formData.serviceTypeId} onChange={handleInputChange}>
                <option value="">서비스 유형을 선택하세요</option>
                {serviceCategories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
              </select>
              {errors.serviceTypeId && <span className="error-message">{errors.serviceTypeId}</span>}
            </div>
          </div>
        </div>

        {/* 상품명 / 설명 */}
        <div className="form-section">
          <div className="form-field">
            <label><Package className="icon"/> 상품명</label>
            <input type="text" name="name" value={formData.name} onChange={handleInputChange} placeholder="상품명을 입력하세요" className={errors.name?"error":""}/>
            {errors.name && <span className="error-message">{errors.name}</span>}
          </div>
          <div className="form-field">
            <label><ClipboardList className="icon"/> 상품 설명</label>
            <textarea name="description" value={formData.description} onChange={handleInputChange} rows="4" placeholder="상품 설명을 입력하세요" className={errors.description?"error":""}/>
            {errors.description && <span className="error-message">{errors.description}</span>}
          </div>
        </div>

        {/* 가격/시간/펫 */}
        <div className="form-section">
          <div className="form-row">
            <div className="form-field">
              <label><CreditCard className="icon"/> 가격(원)</label>
              <input type="number" name="price" value={formData.price} onChange={handleInputChange} min="0" step="100" placeholder="가격" className={errors.price?"error":""}/>
              {errors.price && <span className="error-message">{errors.price}</span>}
            </div>
            <div className="form-field">
              <label><Clock className="icon"/> 소요 시간(분)</label>
              <input type="number" name="duration" value={formData.duration} onChange={handleInputChange} min="1" step="1" placeholder="시간" className={errors.duration?"error":""}/>
              {errors.duration && <span className="error-message">{errors.duration}</span>}
            </div>
          </div>
          <div className="form-row">
            <div className="form-field">
              <label><Dog className="icon"/> 최소 펫 수</label>
              <input type="number" name="minPet" value={formData.minPet} onChange={handleInputChange} min="1" max="10"/>
              {errors.minPet && <span className="error-message">{errors.minPet}</span>}
            </div>
            <div className="form-field">
              <label><Dog className="icon"/> 최대 펫 수</label>
              <input type="number" name="maxPet" value={formData.maxPet} onChange={handleInputChange} min="1" max="10"/>
              {errors.maxPet && <span className="error-message">{errors.maxPet}</span>}
            </div>
          </div>
        </div>

        {/* 슬롯 설정 */}
        <div className="form-section slot-settings-section">
          <h3 className="section-title"><CalendarCheck className="icon-title"/> 예약 슬롯 설정</h3>
          <div className="form-field">
            <label className="checkbox-label">
              <input type="checkbox" name="isAllDay" checked={formData.isAllDay} onChange={handleAllDayChange}/>
              <Sun className="icon"/> 종일 상품 (30일 자동 설정)
            </label>
          </div>
          <div className="date-selection-row">
            <div className="form-field">
              <label>시작 날짜</label>
              <input type="date" value={slotSettings.startDate} onChange={(e)=>setSlotSettings(prev=>({...prev,startDate:e.target.value}))} disabled={formData.isAllDay}/>
            </div>
            <div className="form-field">
              <label>종료 날짜</label>
              <input type="date" value={slotSettings.endDate} onChange={(e)=>setSlotSettings(prev=>({...prev,endDate:e.target.value}))} disabled={formData.isAllDay}/>
            </div>
          </div>
          <div className="form-field">
            <label><Clock className="icon"/> 이용 가능 시간</label>
            <div className="time-selection">
              {generateTimeSlots().map(timeSlot=>(
                <button key={timeSlot} type="button" disabled={formData.isAllDay}
                  className={`time-option ${slotSettings.selectedTimes.includes(timeSlot)?"selected":""} ${formData.isAllDay?"disabled":""}`}
                  onClick={()=>{
                    if(!formData.isAllDay){
                      setSlotSettings(prev=>({
                        ...prev,
                        selectedTimes: prev.selectedTimes.includes(timeSlot)
                          ? prev.selectedTimes.filter(t=>t!==timeSlot)
                          : [...prev.selectedTimes,timeSlot]
                      }))
                    }
                  }}>
                  {timeSlot}
                </button>
              ))}
            </div>
          </div>
          <div className="form-field">
            <label><PawPrint className="icon"/> 수용 가능 펫 수</label>
            <input type="number" min="1" max="10" value={slotSettings.capacity} onChange={(e)=>setSlotSettings(prev=>({...prev,capacity:parseInt(e.target.value)}))}/>
          </div>
        </div>

        {/* 활성화 */}
        <div className="form-field">
          <label className="checkbox-label">
            <input type="checkbox" name="isActive" checked={formData.isActive} onChange={handleInputChange}/>
            <ToggleRight className="icon"/> 등록과 동시에 활성화
          </label>
        </div>

        {/* 버튼 */}
        <div className="form-actions">
          <button type="button" className="btn-cancel" onClick={handleReset} disabled={saving}>초기화</button>
          <button type="button" className="btn-cancel" onClick={handleCancel} disabled={saving}>취소</button>
          <button className="btn-submit" type="submit" disabled={saving}>{saving?"등록 중...":"상품 등록"}</button>
        </div>
      </form>
    </div>
  );
};

export default ProductRegisterPage;
