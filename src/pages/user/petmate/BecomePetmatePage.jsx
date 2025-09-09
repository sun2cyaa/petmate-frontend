// src/pages/petmate/BecomePetmatePage.jsx
import { useState } from "react";
import api from "../../../services/api";


const SVC_OPTIONS = ["돌봄", "산책", "미용", "병원", "기타"];
const PET_OPTIONS = ["강아지", "고양이", "기타"];

export default function BecomePetmatePage() {
  const [form, setForm] = useState({
    name: "",
    gender: "",
    age: "",
    hasCar: false,
    services: [],
    pets: [],
    agree: false,
  });
  const [profileFile, setProfileFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const onChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((f) => ({
      ...f,
      [name]: type === "checkbox" && name !== "hasCar" && name !== "agree" ? f[name] : type === "checkbox" ? checked : value,
    }));
  };

  const toggleMulti = (key, value) => {
    setForm((f) => {
      const set = new Set(f[key]);
      set.has(value) ? set.delete(value) : set.add(value);
      return { ...f, [key]: Array.from(set) };
    });
  };

  const onFile = (e) => {
    const file = e.target.files?.[0];
    setProfileFile(file || null);
    setPreview(file ? URL.createObjectURL(file) : null);
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

    try {
      setSubmitting(true);
      await api.post("/petmate/apply", fd, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("신청이 접수되었습니다.");
      // 초기화
      setForm({
        name: "",
        gender: "",
        age: "",
        hasCar: false,
        services: [],
        pets: [],
        agree: false,
      });
      setProfileFile(null);
      setPreview(null);
    } catch (e1) {
      alert("신청 중 오류가 발생했습니다.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <article style={styles.wrap}>
      <h1 style={styles.title}>펫메이트 되기</h1>

      <form onSubmit={onSubmit} style={styles.form}>
        {/* 이름 */}
        <label style={styles.label}>
          이름
          <input
            name="name"
            value={form.name}
            onChange={onChange}
            placeholder="이름"
            style={styles.input}
          />
        </label>

        {/* 성별/나이 */}
        <div style={styles.row}>
          <label style={{ ...styles.label, flex: 1 }}>
            성별
            <select
              name="gender"
              value={form.gender}
              onChange={onChange}
              style={styles.select}
            >
              <option value="">선택</option>
              <option value="M">남성</option>
              <option value="F">여성</option>
              <option value="N">기타</option>
            </select>
          </label>

          <label style={{ ...styles.label, flex: 1 }}>
            나이
            <input
              type="number"
              name="age"
              min={18}
              value={form.age}
              onChange={onChange}
              placeholder="예: 28"
              style={styles.input}
            />
          </label>
        </div>

        {/* 자차 보유 */}
        <label style={{ ...styles.label, flexDirection: "row", alignItems: "center", gap: 8 }}>
          <input
            type="checkbox"
            name="hasCar"
            checked={form.hasCar}
            onChange={onChange}
          />
          자차 보유
        </label>

        {/* 프로필 사진 업로드 */}
        <label style={styles.label}>
          프로필 사진
          <input type="file" accept="image/*" onChange={onFile} />
          {preview && (
            <img
              src={preview}
              alt="미리보기"
              style={{ width: 96, height: 96, borderRadius: 12, objectFit: "cover", marginTop: 8 }}
            />
          )}
        </label>

        {/* 제공 서비스 */}
        <div style={styles.label}>
          제공 서비스
          <div style={styles.chips}>
            {SVC_OPTIONS.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => toggleMulti("services", s)}
                style={{
                  ...styles.chip,
                  ...(form.services.includes(s) ? styles.chipOn : {}),
                }}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* 케어 가능 펫 */}
        <div style={styles.label}>
          케어 가능 펫
          <div style={styles.chips}>
            {PET_OPTIONS.map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => toggleMulti("pets", p)}
                style={{
                  ...styles.chip,
                  ...(form.pets.includes(p) ? styles.chipOn : {}),
                }}
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        {/* 약관 동의 */}
        <label style={{ ...styles.label, flexDirection: "row", alignItems: "center", gap: 8 }}>
          <input
            type="checkbox"
            name="agree"
            checked={form.agree}
            onChange={onChange}
          />
          서비스 약관 및 개인정보 처리방침에 동의합니다.
        </label>

        <div style={styles.actions}>
          <button type="submit" disabled={submitting} style={styles.primary}>
            {submitting ? "등록 중..." : "등록"}
          </button>
          <button type="button" onClick={() => window.history.back()} style={styles.ghost}>
            취소
          </button>
        </div>
      </form>
    </article>
  );
}

const styles = {
  wrap: { maxWidth: 860, margin: "32px auto", padding: "0 16px" },
  title: { fontSize: 28, fontWeight: 800, marginBottom: 16 },
  form: { display: "grid", gap: 16 },
  row: { display: "flex", gap: 12 },
  label: { display: "flex", flexDirection: "column", gap: 8, fontWeight: 600 },
  input: { height: 40, padding: "8px 12px", borderRadius: 8, border: "1px solid #e5e7eb" },
  select: { height: 40, padding: "0 12px", borderRadius: 8, border: "1px solid #e5e7eb" },
  chips: { display: "flex", gap: 8, flexWrap: "wrap", marginTop: 6 },
  chip: {
    border: "1px solid #e5e7eb",
    borderRadius: 9999,
    padding: "8px 12px",
    background: "#fff",
    cursor: "pointer",
  },
  chipOn: { background: "#16a34a", color: "#fff", borderColor: "#16a34a" },
  actions: { display: "flex", gap: 8, marginTop: 8 },
  primary: {
    padding: "10px 16px",
    background: "#16a34a",
    color: "#fff",
    border: 0,
    borderRadius: 10,
    cursor: "pointer",
    minWidth: 100,
  },
  ghost: {
    padding: "10px 16px",
    background: "#fff",
    color: "#111827",
    border: "1px solid #e5e7eb",
    borderRadius: 10,
    cursor: "pointer",
    minWidth: 100,
  },
};
