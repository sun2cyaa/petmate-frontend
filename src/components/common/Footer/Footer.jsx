import "./Footer.css";

import facebookIcon from "../../../assets/icons/footer/facebook.png";
import twitterIcon from "../../../assets/icons/footer/twitter.png";
import instargramIcon from "../../../assets/icons/footer/instargram.png";
import blogIcon from "../../../assets/icons/footer/blog.png";

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-top">
        {/* 브랜드 및 회사 정보 */}
        <div className="footer-brand">
          <h3>Petmate</h3>
          <p>반려동물을 위한 올인원 케어 플랫폼</p>
          <p>경기 광명시 양지로 17</p>
          <p>대표: 독고건 | 사업자등록번호: 374-12-45781</p>
          <p>통신판매업 신고번호: 2025 - 경기도 광명 - 1457</p>
          <p>이메일: 4424904@petmate.com</p>

          <div className="footer-social">
            <a href="#none"><img src={facebookIcon} alt="Facebook" /></a>
            <a href="#none"><img src={twitterIcon} alt="Twitter" /></a>
            <a href="#none"><img src={instargramIcon} alt="Instagram" /></a>
            <a href="#none"><img src={blogIcon} alt="Blog" /></a>
          </div>

          <p className="footer-tel">고객센터 1577-1013 (24시간 연중무휴)</p>
        </div>

        {/* 링크 섹션 */}
        <div className="footer-links">
          <div className="footer-links-col">
            <h4>Petmate</h4>
            <ul>
              <li><a className="footer-link" href="/policy/terms">이용약관</a></li>
              <li><a className="footer-link" href="/policy/privacy">개인정보처리방침</a></li>
              <li><a className="footer-link" href="/policy/copyright">저작권보호정책</a></li>
              <li><a className="footer-link" href="/policy/operation">운영관리 방침</a></li>
            </ul>
          </div>
          <div className="footer-links-col">
            <h4>고객지원</h4>
            <ul>
              <li><a className="footer-link" href="/support/FAQ">FAQ</a></li>
              <li><a className="footer-link" href="/support/Inquiry">1:1 문의</a></li>
              <li><a className="footer-link" href="/support/CustomerCenter">고객센터</a></li>
            </ul>
          </div>
        </div>
      </div>

      {/* 브랜드 메시지 */}
      <div className="footer-middle">
        간편한 통합 예약 시스템으로 반려동물과의 더 나은 라이프스타일 제공<br />
        우리는 유기동물을 응원합니다. 수익금 일부는 한국유기동물복지협회에 기부됩니다.
      </div>

      {/* 저작권 */}
      <div className="footer-bottom">
        © 2025 Petmate. All Rights Reserved.
      </div>
    </footer>
  );
}

export default Footer;
