// src/pages/petmate/BecomePetmatePage.jsx
import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { apiRequest } from "../../../services/api";
import "./PetMateSignupPage.css";
import { ImageUploadViewer } from "../../../util/ImageUtil";

export default function PetMateSignupPage() {
    const nav = useNavigate();
    const imageUploadRef = useRef(null);
    const [form, setForm] = useState({
        email: "",
        provider: "",
        name: "",
        nickName: "",
        phone: "",
        gender: "",
        age: "",
        hasCar: false,
        services: [],
        pets: [],
        agree: false,
    });
    const [profileFile, setProfileFile] = useState(null);
    const [profilePreview, setProfilePreview] = useState(null);
    const [certFiles, setCertFiles] = useState([]);       // File[]
    const [certPreviews, setCertPreviews] = useState([]); // { name, url }[]
    const [submitting, setSubmitting] = useState(false);
    const [doneOpen, setDoneOpen] = useState(false);
    const [profileDragOver, setProfileDragOver] = useState(false);
    const [certDragOver, setCertDragOver] = useState(false);

    useEffect(() => {
        apiRequest.get("/auth/me", { withCredentials: true })
            .then((res) => {
                const u = res?.data || {};
                setForm((f) => ({
                    ...f,
                    email: u.email || "",
                    provider: (u.provider || "OAUTH2").toUpperCase(),
                    name: u.name || u.email || "",
                    nickName: u.nickName || u.nickname || "",
                    phone: u.phone || "",
                    userId: u.userId || "",
                }));
                if (u.picture) setProfilePreview(u.picture);
            })
            .catch(() => { });
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
            const file = files[0]; setProfileFile(file); setProfilePreview(URL.createObjectURL(file));
        }
    };
    const onProfileFile = (e) => {
        const file = e.target.files?.[0] || null;
        if (file) { setProfileFile(file); setProfilePreview(URL.createObjectURL(file)); }
    };

    // ===== 자격증 업로드: 추가(append) 방식 =====
    const appendCerts = (incoming) => {
        const images = incoming.filter((f) => f && f.type?.startsWith("image/"));
        if (images.length === 0) return;

        // 중복 방지: name+size 기준
        setCertFiles((prev) => {
            const prevKey = new Set(prev.map((f) => `${f.name}:${f.size}`));
            const dedup = images.filter((f) => !prevKey.has(`${f.name}:${f.size}`));
            return [...prev, ...dedup];
        });

        setCertPreviews((prev) => {
            const prevKey = new Set(prev.map((p) => p.name));
            const toAdd = images.map((f) => ({ name: `${f.name}:${f.size}`, url: URL.createObjectURL(f) }));
            // 프리뷰 키도 name:size로 맞춤
            const filtered = toAdd.filter((p) => !prevKey.has(p.name));
            return [...prev, ...filtered];
        });
    };

    const handleCertDragOver = (e) => { e.preventDefault(); setCertDragOver(true); };
    const handleCertDragLeave = (e) => { e.preventDefault(); setCertDragOver(false); };
    const handleCertDrop = (e) => {
        e.preventDefault(); setCertDragOver(false);
        const files = Array.from(e.dataTransfer.files || []);
        appendCerts(files);
    };
    const onCertFiles = (e) => {
        const files = Array.from(e.target.files || []);
        appendCerts(files);
        e.target.value = ""; // 같은 파일 재선택 시도 가능하도록 리셋
    };

    const removeCertFile = (index) => {
        setCertFiles((files) => files.filter((_, i) => i !== index));
        setCertPreviews((prev) => prev.filter((_, i) => i !== index));
    };

    // ===== 검증 및 제출 =====
    const validate = () => {
        if (!form.name.trim()) return "이름을 입력하세요.";
        if (!form.gender) return "성별을 선택하세요.";
        if (!form.age || Number(form.age) < 18) return "나이는 18세 이상 입력하세요.";
        if (!form.agree) return "약관에 동의해야 합니다.";
        if (!form.email) return "이메일 정보를 불러오지 못했습니다. 다시 로그인하세요.";
        if (!form.provider) return "Provider가 비어 있습니다.";
        return null;
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        const err = validate();
        if (err) return alert(err);

        try {
            setSubmitting(true);

            // 참고: ImageUploadViewer의 이미지들은 관리 모드에서 개별적으로 업로드되므로
            // 여기서는 별도로 업로드하지 않습니다.

            const fd = new FormData();
            fd.append("email", form.email);
            fd.append("provider", form.provider);   // 히든 전송
            fd.append("name", form.name.trim());
            fd.append("nickName", form.nickName || "");
            fd.append("phone", form.phone || "");
            fd.append("gender", form.gender);
            fd.append("age", String(form.age));
            fd.append("userId", form.userId);

            if (profileFile) fd.append("profile", profileFile);
            certFiles.forEach((f) => fd.append("certificates", f)); // 누적된 파일 전송

            await apiRequest.post("/user/petmate/apply", fd, { withCredentials: true });
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
                <div className="petmate-note">소셜 로그인 정보는 자동으로 활용됩니다. 필요 시 수정하세요.</div>
            </div>

            <form onSubmit={onSubmit} className="petmate-form">
                {/* 히든: provider 전송 */}
                <input type="hidden" name="provider" value={form.provider} />

                <section className="form-section">
                    <h3 className="section-title">개인 정보</h3>

                    {/* 1열: 이름, 닉네임, 휴대폰 */}
                    <div className="petmate-row" style={{ marginBottom: 16 }}>
                        <div className="form-group">
                            <label className="form-label">이름</label>
                            <input name="name" value={form.name} onChange={onChange} placeholder="이름을 입력하세요" className="form-input" />
                        </div>
                        <div className="form-group">
                            <label className="form-label">닉네임</label>
                            <input name="nickName" value={form.nickName} onChange={onChange} placeholder="닉네임을 입력하세요" className="form-input" />
                        </div>
                        <div className="form-group">
                            <label className="form-label">휴대폰</label>
                            <input name="phone" value={form.phone} onChange={onChange} placeholder="예: 010-1234-5678" className="form-input" />
                        </div>
                    </div>

                    {/* 2열: 성별, 나이 */}
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
                            <input type="number" name="age" min={18} value={form.age} onChange={onChange} placeholder="예: 28" className="form-input" />
                        </div>
                        <div className="form-group">{/* 자리맞춤 */}</div>
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
                                    <img
                                        src={profilePreview}
                                        alt="프로필"
                                        referrerPolicy="no-referrer"
                                        crossOrigin="anonymous"
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
                            <input id="petmate-profile-input" type="file" accept="image/*" onChange={onProfileFile} hidden />
                        </div>
                    </div>
                </section>

                <section className="form-section">
                    <h3 className="section-title">자격증 및 증빙서류</h3>
                    <div className="form-group">
                        <label className="form-label">자격증 업로드</label>
                        <ImageUploadViewer
                            ref={imageUploadRef}
                            imageTypeCode="05"
                            referenceId={form.userId}
                            mode="multiple"
                            files={certFiles}
                            setFiles={setCertFiles}
                        />
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
