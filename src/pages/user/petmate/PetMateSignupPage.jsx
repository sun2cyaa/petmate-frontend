import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { apiRequest } from "../../../services/api";
import { useAuth } from "../../../contexts/AuthContext";
import "./PetMateSignupPage.css";
import { ImageUploadViewer } from "../../../util/ImageUtil";
import { motion } from "framer-motion";
import Lottie from "lottie-react";
import * as Dialog from "@radix-ui/react-dialog";
import successAnim from "../../../assets/lottie/success.json";

function PetMateSignupPage() {
  const nav = useNavigate();
  const { hydrateMe } = useAuth();
  const profileImageRef = useRef(null);
  const certImageRef = useRef(null);

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
  const [submitting, setSubmitting] = useState(false);
  const [doneOpen, setDoneOpen] = useState(false);
  const [profileFile, setProfileFile] = useState([]);
  const [certFiles, setCertFiles] = useState([]);

  useEffect(() => {
    apiRequest
      .get("/auth/me", { withCredentials: true })
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
      })
      .catch(() => {});
  }, []);

  const onChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((f) => ({ ...f, [name]: type === "checkbox" ? checked : value }));
  };

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

      if (profileImageRef.current && profileImageRef.current.hasFiles) {
        await profileImageRef.current.handleUpload();
      }
      if (certImageRef.current && certImageRef.current.hasFiles) {
        await certImageRef.current.handleUpload();
      }

      const fd = new FormData();
      fd.append("email", form.email);
      fd.append("provider", form.provider);
      fd.append("name", form.name.trim());
      fd.append("nickName", form.nickName || "");
      fd.append("phone", form.phone || "");
      fd.append("gender", form.gender);
      fd.append("age", String(form.age));
      fd.append("userId", form.userId);

      const res = await apiRequest.post("/user/petmate/apply", fd);
      if (!res) return;
      await hydrateMe();
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
        <p className="petmate-subtitle">
          반려동물과 함께하는 특별한 여정을 시작하세요
        </p>
        <div className="petmate-note">
          소셜 로그인 정보는 자동으로 활용됩니다. 필요 시 수정하세요.
        </div>
      </div>

      <form onSubmit={onSubmit} className="petmate-form">
        <input type="hidden" name="provider" value={form.provider} />

        <section className="form-section">
          <h3 className="section-title">개인 정보</h3>

          <div className="petmate-row" style={{ marginBottom: 16 }}>
            <div className="form-group">
              <label className="form-label">이름</label>
              <input
                name="name"
                value={form.name}
                onChange={onChange}
                placeholder="이름을 입력하세요"
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label className="form-label">닉네임</label>
              <input
                name="nickName"
                value={form.nickName}
                onChange={onChange}
                placeholder="닉네임을 입력하세요"
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label className="form-label">휴대폰</label>
              <input
                name="phone"
                value={form.phone}
                onChange={onChange}
                placeholder="예: 010-1234-5678"
                className="form-input"
              />
            </div>
          </div>

          <div className="petmate-row">
            <div className="form-group">
              <label className="form-label">성별</label>
              <select
                name="gender"
                value={form.gender}
                onChange={onChange}
                className="form-select"
              >
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
                min={18}
                value={form.age}
                onChange={onChange}
                placeholder="예: 28"
                className="form-input"
              />
            </div>
            <div className="form-group">{/* 자리맞춤 */}</div>
          </div>

          <div className="form-group">
            <label className="form-label">프로필 사진</label>
            <ImageUploadViewer
              ref={profileImageRef}
              className="profile-upload"
              imageTypeCode="06"
              referenceId={form.email}
              mode="single"
              files={profileFile}
              setFiles={setProfileFile}
            />
          </div>
        </section>

        <section className="form-section">
          <h3 className="section-title">자격증 및 증빙서류</h3>
          <div className="form-group">
            <label className="form-label">자격증 업로드</label>
            <ImageUploadViewer
              ref={certImageRef}
              className="cert-upload"
              imageTypeCode="05"
              referenceId={form.email}
              mode="multiple"
              files={certFiles}
              setFiles={setCertFiles}
            />
          </div>
        </section>

        <section className="form-section">
          <label className="form-check agreement">
            <input
              type="checkbox"
              name="agree"
              checked={form.agree}
              onChange={onChange}
            />
            <span className="checkmark"></span>
            <span className="agreement-text">
              <strong>서비스 약관 및 개인정보 처리방침</strong>에 동의합니다.
            </span>
          </label>
        </section>

        <div className="form-actions">
          <button type="submit" disabled={submitting} className="btn-primary">
            {submitting ? (
              <>
                <span className="loading-spinner"></span>등록 중...
              </>
            ) : (
              "펫메이트 신청하기"
            )}
          </button>
          <button
            type="button"
            onClick={() => nav(-1)}
            className="btn-secondary"
          >
            취소
          </button>
        </div>
      </form>

      {/* 모달 */}
      <Dialog.Root open={doneOpen} onOpenChange={setDoneOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="radix-overlay" />
          <Dialog.Content className="radix-content">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.25 }}
            >
              <div className="modal-icon">
                <Lottie
                  animationData={successAnim}
                  loop={false}
                  speed={1.5}
                  style={{ width: 200, height: 200, margin: "0 auto" }}
                />
              </div>
              <Dialog.Title className="modal-title">축하합니다!</Dialog.Title>
              <Dialog.Description className="modal-desc">
                이제 당신도 펫메이트입니다! <br />
                소속된 업체를 등록하시겠습니까? <br />
                이미 업체가 있다면 건너뛰고 소속을 지정해주세요.
              </Dialog.Description>

              <div className="modal-actions">
                <button
                  className="btn-primary"
                  onClick={() => nav("/company/register", { replace: true })}
                >
                  업체 등록하기
                </button>
                <button
                  className="btn-secondary"
                  onClick={() => nav("/company/select", { replace: true })}
                >
                  건너뛰기
                </button>
              </div>
            </motion.div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </article>
  );
}

export default PetMateSignupPage;
