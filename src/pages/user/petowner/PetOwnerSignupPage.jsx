// src/pages/petowner/BecomePetOwnerPage.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../petmate/PetMateSignupPage.css";
import { apiRequest, fetchMe } from "../../../services/api";
import { useAuth } from "../../../contexts/AuthContext";

export default function PetOwnerSignupPage() {
  const nav = useNavigate();
  const { hydrateMe } = useAuth();

  const [form, setForm] = useState({
    email: "",
    provider: "",
    name: "",
    gender: "",
    age: "",
    agree: false,
  });

  const [profileFile, setProfileFile] = useState(null);
  const [profilePreview, setProfilePreview] = useState(null);

  const [submitting, setSubmitting] = useState(false);
  const [doneOpen, setDoneOpen] = useState(false);

  const [profileDragOver, setProfileDragOver] = useState(false);

  const calcAge = (birthDateStr) => {
    if (!birthDateStr) return "";
    const birth = new Date(birthDateStr);
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
    return age;
  };

  useEffect(() => {
    (async () => {
      const u = await fetchMe({ silent: true });
      if (!u) return;
      setForm((f) => ({
        ...f,
        email: u.email || "",
        provider: (u.provider || "OAUTH2").toUpperCase(),
        name: u.name || u.nickname || u.email || "",
        gender: u.gender || "",
        age: u.birthDate ? calcAge(u.birthDate) : "",
      }));
      const img = u.profileImage || u.picture || u.avatarUrl;
      if (img) setProfilePreview(img);
    })();
  }, []);

  const onChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((f) => ({ ...f, [name]: type === "checkbox" ? checked : value }));
  };

  // ===== 프로필 업로드 =====
  const handleProfileDragOver = (e) => { e.preventDefault(); setProfileDragOver(true); };
  const handleProfileDragLeave = (e) => { e.preventDefault(); setProfileDragOver(false); };
  const handleProfileDrop = (e) => {
    e.preventDefault(); setProfileDragOver(false);
    const files = e.dataTransfer.files;
    if (files.length > 0 && files[0].type.startsWith("image/")) {
      const file = files[0];
      setProfileFile(file);
      setProfilePreview(URL.createObjectURL(file));
    }
  };
  const onProfileFile = (e) => {
    const file = e.target.files?.[0] || null;
    if (file) { setProfileFile(file); setProfilePreview(URL.createObjectURL(file)); }
  };

  // ===== 검증 및 제출 =====
  const validate = () => {
    if (!form.name.trim()) return "이름을 입력하세요.";
    if (!form.gender) return "성별을 선택하세요.";
    if (!form.age || Number(form.age) < 14) return "나이는 14세 이상 입력하세요.";
    if (!form.agree) return "약관에 동의해야 합니다.";
    if (!form.email) return "이메일 정보를 불러오지 못했습니다. 다시 로그인하세요.";
    if (!form.provider) return "Provider가 비어 있습니다.";
    return null;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const err = validate();
    if (err) return alert(err);

    const fd = new FormData();
    fd.append("email", form.email);
    fd.append("provider", form.provider);
    fd.append("name", form.name.trim());
    fd.append("gender", form.gender);
    fd.append("age", String(form.age));
    if (profileFile) fd.append("profile", profileFile);

    try {
      setSubmitting(true);
      await apiRequest.post("/user/petowner/apply", fd);
      // 상태 최신화 + 디버깅 로그
      console.log(">>> /user/petowner/apply 완료됨");
      const me = await fetchMe({ silent: false });
      console.log(">>> /auth/me 응답:", me);
      await hydrateMe();
      setDoneOpen(true);
    } catch (e2) {
      console.error("pet owner apply error:", e2?.response?.status, e2?.response?.data, e2);
      alert(`신청 중 오류가 발생했습니다. (${e2?.response?.status ?? "알수없음"})`);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <article id="petowner-container" className="petmate-wrap">
      <div className="petmate-header">
        <h1 className="petmate-title">반려인 되기</h1>
        <p className="petmate-subtitle">반려동물과의 일상을 더 편하게 시작하세요</p>
        <div className="petmate-note">소셜 로그인 정보를 불러옵니다. 필요 시 수정하세요.</div>
      </div>

      <form onSubmit={onSubmit} className="petmate-form">
        <input type="hidden" name="provider" value={form.provider} />

        <section className="form-section">
          <h3 className="section-title">기본 정보</h3>

          <div className="form-group">
            <label className="form-label">이름</label>
            <input name="name" value={form.name} onChange={onChange} className="form-input" />
          </div>

          <div className="form-group">
            <label className="form-label">프로필 사진</label>
            <div
              className={`drop-zone ${profileDragOver ? "drag-over" : ""} ${profilePreview ? "has-image" : ""}`}
              onDragOver={handleProfileDragOver}
              onDragLeave={handleProfileDragLeave}
              onDrop={handleProfileDrop}
              onClick={() => document.getElementById("petowner-profile-input")?.click()}
            >
              {profilePreview ? (
                <div className="image-preview">
                  <img
                    src={profilePreview}
                    alt="프로필"
                    referrerPolicy="no-referrer"
                    onError={() => setProfilePreview(null)}
                  />
                  <div className="image-overlay"><span>클릭하거나 드래그하여 변경</span></div>
                </div>
              ) : (
                <div className="drop-zone-content">
                  <div className="drop-icon">📷</div>
                  <p>프로필 사진을 드래그하거나 클릭하여 업로드</p>
                  <span className="drop-hint">JPG, PNG 파일만 지원</span>
                </div>
              )}
              <input id="petowner-profile-input" type="file" accept="image/*" onChange={onProfileFile} hidden />
            </div>
          </div>

          <div className="petmate-row">
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
              <input
                type="number"
                name="age"
                min={14}
                value={form.age}
                onChange={onChange}
                className="form-input"
              />
            </div>
            <div className="form-group">{/* spacer */}</div>
          </div>
        </section>

        <section className="form-section">
          <label className="form-check agreement">
            <input type="checkbox" name="agree" checked={form.agree} onChange={onChange} />
            <span className="checkmark"></span>
            <span className="agreement-text">
              <strong>서비스 약관 및 개인정보 처리방침</strong>에 동의합니다.
            </span>
          </label>
        </section>

        <div className="form-actions">
          <button type="submit" disabled={submitting} className="btn-primary">
            {submitting ? (<><span className="loading-spinner"></span>등록 중...</>) : "반려인 신청하기"}
          </button>
          <button type="button" onClick={() => nav(-1)} className="btn-secondary">취소</button>
        </div>
      </form>

      {doneOpen && (
        <div className="modal-backdrop" onClick={() => setDoneOpen(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-icon">🎉</div>
            <h2>축하합니다!</h2>
            <p>반려인 등록이 완료되었습니다.</p>
            <p className="modal-subtitle">펫을 등록하시겠습니까?</p>
            <div className="modal-actions">
              <button className="btn-primary" onClick={() => nav("/pets", { replace: true })}>
                펫 등록하기
              </button>
              <button className="btn-secondary" onClick={() => nav("/home", { replace: true })}>
                건너뛰기
              </button>
            </div>
          </div>
        </div>
      )}
    </article>
  );
}
