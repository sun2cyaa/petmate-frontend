// src/pages/petmate/BecomePetmatePage.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./PetMateSignupPage.css";
import api from "../../../services/api";

const SVC_OPTIONS = ["돌봄", "산책", "미용", "병원", "기타"];
const PET_OPTIONS = ["강아지", "고양이", "기타"];
const OTHER_PET_OPTIONS = ["햄스터","토끼","새","파충류","물고기","페럿","고슴도치","친칠라"];

export default function PetMateSignupPage() {
  const nav = useNavigate();
  const [form, setForm] = useState({
    name: "", gender: "", age: "", hasCar: false, services: [], pets: [], agree: false,
  });
  const [profileFile, setProfileFile] = useState(null);
  const [profilePreview, setProfilePreview] = useState(null);
  const [certFiles, setCertFiles] = useState([]);
  const [certPreviews, setCertPreviews] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [doneOpen, setDoneOpen] = useState(false);
  const [profileDragOver, setProfileDragOver] = useState(false);
  const [certDragOver, setCertDragOver] = useState(false);
  const [showOtherPets, setShowOtherPets] = useState(false);
  const [customPet, setCustomPet] = useState("");

  useEffect(() => {
    api.get("/auth/me", { withCredentials: true }).then((res) => {
      const u = res.data || {};
      setForm((f) => ({ ...f, name: u.name || u.email || "" }));
      if (u.picture) setProfilePreview(u.picture);
    }).catch(() => {});
  }, []);

  const onChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((f) => ({ ...f, [name]: type === "checkbox" ? checked : value }));
  };

  const toggleMulti = (key, value) => {
    setForm((f) => {
      const set = new Set(f[key]);
      if (value === "기타" && key === "pets") {
        if (set.has("기타")) { set.delete("기타"); setShowOtherPets(false); }
        else { set.add("기타"); setShowOtherPets(true); }
      } else { set.has(value) ? set.delete(value) : set.add(value); }
      return { ...f, [key]: Array.from(set) };
    });
  };

  const addCustomPet = () => {
    if (customPet.trim()) {
      setForm((f) => ({ ...f, pets: [...new Set([...f.pets, customPet.trim()])] }));
      setCustomPet("");
    }
  };
  const removeCustomPet = (petToRemove) => {
    setForm((f) => ({ ...f, pets: f.pets.filter((pet) => pet !== petToRemove) }));
  };

  const handleProfileDragOver = (e) => { e.preventDefault(); setProfileDragOver(true); };
  const handleProfileDragLeave = (e) => { e.preventDefault(); setProfileDragOver(false); };
  const handleProfileDrop = (e) => {
    e.preventDefault(); setProfileDragOver(false);
    const files = e.dataTransfer.files;
    if (files.length > 0 && files[0].type.startsWith("image/")) {
      const file = files[0]; setProfileFile(file); setProfilePreview(URL.createObjectURL(file));
    }
  };
  const onProfileFile = (e) => {
    const file = e.target.files?.[0] || null;
    if (file) { setProfileFile(file); setProfilePreview(URL.createObjectURL(file)); }
  };

  const handleCertDragOver = (e) => { e.preventDefault(); setCertDragOver(true); };
  const handleCertDragLeave = (e) => { e.preventDefault(); setCertDragOver(false); };
  const handleCertDrop = (e) => {
    e.preventDefault(); setCertDragOver(false);
    const files = Array.from(e.dataTransfer.files).filter((file) => file.type.startsWith("image/"));
    if (files.length > 0) {
      setCertFiles(files);
      setCertPreviews(files.map((f) => ({ name: f.name, url: URL.createObjectURL(f) })));
    }
  };
  const onCertFiles = (e) => {
    const files = Array.from(e.target.files || []);
    setCertFiles(files);
    setCertPreviews(files.map((f) => ({ name: f.name, url: URL.createObjectURL(f) })));
  };
  const removeCertFile = (index) => {
    setCertFiles((files) => files.filter((_, i) => i !== index));
    setCertPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const validate = () => {
    if (!form.name.trim()) return "이름을 입력하세요.";
    if (!form.gender) return "성별을 선택하세요.";
    if (!form.age || Number(form.age) < 18) return "나이는 18세 이상 입력하세요.";
    if (form.services.length === 0) return "제공 서비스 1개 이상 선택하세요.";
    if (form.pets.length === 0) return "케어 가능 펫 1개 이상 선택하세요.";
    if (!form.agree) return "약관에 동의해야 합니다.";
    return null;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const err = validate();
    if (err) return alert(err);

    const fd = new FormData();
    fd.append("name", form.name.trim());
    fd.append("gender", form.gender);
    fd.append("age", String(form.age));
    fd.append("hasCar", String(form.hasCar));
    fd.append("services", JSON.stringify(form.services));
    fd.append("pets", JSON.stringify(form.pets));
    if (profileFile) fd.append("profile", profileFile);
    certFiles.forEach((f) => fd.append("certificates", f));

    try {
      setSubmitting(true);
      // 헤더 지정 금지: Axios가 boundary 포함 자동 설정
      await api.post("/petmate/apply", fd, { withCredentials: true });
      setDoneOpen(true);
    } catch (e2) {
      console.error("apply error:", e2?.response?.status, e2?.response?.data, e2);
      alert(`신청 중 오류가 발생했습니다. (${e2?.response?.status ?? "알수없음"})`);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <article id="petmate-container" className="petmate-wrap">
      <div className="petmate-header">
        <h1 className="petmate-title">펫메이트 되기</h1>
        <p className="petmate-subtitle">반려동물과 함께하는 특별한 여정을 시작하세요</p>
        <div className="petmate-note">💡 소셜 로그인 정보는 자동으로 활용됩니다. 필요 시 수정하세요.</div>
      </div>

      <form onSubmit={onSubmit} className="petmate-form">
        <section className="form-section">
          <h3 className="section-title">개인 정보</h3>
          <div className="petmate-row">
            <div className="form-group">
              <label className="form-label">이름</label>
              <input name="name" value={form.name} onChange={onChange} placeholder="이름을 입력하세요" className="form-input"/>
            </div>
            <div className="form-group">
              <label className="form-label">성별</label>
              <select name="gender" value={form.gender} onChange={onChange} className="form-select">
                <option value="">선택하세요</option>
                <option value="M">남성</option>
                <option value="F">여성</option>
                <option value="N">기타</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">나이</label>
              <input type="number" name="age" min={18} value={form.age} onChange={onChange} placeholder="예: 28" className="form-input"/>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">프로필 사진</label>
            <div
              className={`drop-zone ${profileDragOver ? "drag-over" : ""} ${profilePreview ? "has-image" : ""}`}
              onDragOver={handleProfileDragOver}
              onDragLeave={handleProfileDragLeave}
              onDrop={handleProfileDrop}
              onClick={() => document.getElementById("petmate-profile-input")?.click()}
            >
              {profilePreview ? (
                <div className="image-preview">
                  <img src={profilePreview} alt="프로필" />
                  <div className="image-overlay"><span>클릭하거나 드래그하여 변경</span></div>
                </div>
              ) : (
                <div className="drop-zone-content">
                  <div className="drop-icon">📷</div>
                  <p>프로필 사진을 드래그하거나 클릭하여 업로드</p>
                  <span className="drop-hint">JPG, PNG 파일만 지원</span>
                </div>
              )}
              <input id="petmate-profile-input" type="file" accept="image/*" onChange={onProfileFile} hidden />
            </div>
          </div>
        </section>

        <section className="form-section">
          <h3 className="section-title">서비스 정보</h3>
          <div className="form-group">
            <label className="form-label">제공 가능한 서비스</label>
            <div className="chip-container">
              {SVC_OPTIONS.map((service) => (
                <button key={service} type="button"
                  onClick={() => toggleMulti("services", service)}
                  className={`chip ${form.services.includes(service) ? "active" : ""}`}>
                  {service}
                </button>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">케어 가능한 반려동물</label>
            <div className="chip-container">
              {PET_OPTIONS.map((pet) => (
                <button key={pet} type="button"
                  onClick={() => toggleMulti("pets", pet)}
                  className={`chip ${form.pets.includes(pet) ? "active" : ""}`}>
                  {pet}
                </button>
              ))}
            </div>

            {showOtherPets && (
              <div className="other-pets-section">
                <div className="other-pets-grid">
                  {OTHER_PET_OPTIONS.map((pet) => (
                    <button key={pet} type="button"
                      onClick={() => toggleMulti("pets", pet)}
                      className={`chip small ${form.pets.includes(pet) ? "active" : ""}`}>
                      {pet}
                    </button>
                  ))}
                </div>

                <div className="custom-pet-input">
                  <input type="text" value={customPet} onChange={(e) => setCustomPet(e.target.value)}
                         placeholder="직접 입력하기" className="form-input"
                         onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addCustomPet())}/>
                  <button type="button" onClick={addCustomPet} className="btn-add">추가</button>
                </div>

                {form.pets.filter((p) => !PET_OPTIONS.includes(p) && !OTHER_PET_OPTIONS.includes(p)).length > 0 && (
                  <div className="selected-custom-pets">
                    {form.pets.filter((p) => !PET_OPTIONS.includes(p) && !OTHER_PET_OPTIONS.includes(p)).map((p) => (
                      <span key={p} className="custom-pet-tag">
                        {p}
                        <button type="button" onClick={() => removeCustomPet(p)} className="remove-btn">×</button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="form-group">
            <label className="form-check">
              <input type="checkbox" name="hasCar" checked={form.hasCar} onChange={onChange} />
              <span className="checkmark"></span>
              자차 보유 (이동 서비스 가능)
            </label>
          </div>
        </section>

        <section className="form-section">
          <h3 className="section-title">자격증 및 증빙서류</h3>
          <div className="form-group">
            <label className="form-label">자격증 업로드</label>
            <div
              className={`drop-zone cert-drop-zone ${certDragOver ? "drag-over" : ""}`}
              onDragOver={handleCertDragOver}
              onDragLeave={handleCertDragLeave}
              onDrop={handleCertDrop}
              onClick={() => document.getElementById("petmate-cert-input")?.click()}
            >
              <div className="drop-zone-content">
                <div className="drop-icon">📄</div>
                <p>자격증을 드래그하거나 클릭하여 업로드</p>
                <span className="drop-hint">여러 파일 동시 업로드 가능</span>
              </div>
              <input id="petmate-cert-input" type="file" accept="image/*" multiple onChange={onCertFiles} hidden />
            </div>

            {certPreviews.length > 0 && (
              <div className="cert-previews">
                {certPreviews.map((cert, index) => (
                  <div key={index} className="cert-preview">
                    <img src={cert.url} alt={cert.name} />
                    <div className="cert-info">
                      <span className="cert-name">{cert.name}</span>
                      <button type="button" onClick={() => removeCertFile(index)} className="remove-cert-btn">삭제</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        <section className="form-section">
          <label className="form-check agreement">
            <input type="checkbox" name="agree" checked={form.agree} onChange={onChange} />
            <span className="checkmark"></span>
            <span className="agreement-text"><strong>서비스 약관 및 개인정보 처리방침</strong>에 동의합니다.</span>
          </label>
        </section>

        <div className="form-actions">
          <button type="submit" disabled={submitting} className="btn-primary">
            {submitting ? (<><span className="loading-spinner"></span>등록 중...</>) : "펫메이트 신청하기"}
          </button>
          <button type="button" onClick={() => nav(-1)} className="btn-secondary">취소</button>
        </div>
      </form>

      {doneOpen && (
        <div className="modal-backdrop" onClick={() => setDoneOpen(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-icon">🎉</div>
            <h2>축하합니다!</h2>
            <p>이제 당신도 펫메이트입니다!</p>
            <p className="modal-subtitle">
              소속된 업체를 펫메이트에 등록하시겠습니까?<br />이미 업체가 등록되어 있다면 건너뛰기 후 소속된 업체를 지정해주세요.
            </p>
            <div className="modal-actions">
              <button className="btn-primary" onClick={() => nav("/company/register", { replace: true })}>업체 등록하기</button>
              <button className="btn-secondary" onClick={() => nav("/company/select", { replace: true })}>건너뛰기</button>
            </div>
          </div>
        </div>
      )}
    </article>
  );
}
