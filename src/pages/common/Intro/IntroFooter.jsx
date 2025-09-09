import "./IntroFooter.css";

import facebookIcon from "../../../assets/icons/footer/facebook.png";
import twitterIcon from "../../../assets/icons/footer/twitter.png";
import instargramIcon from "../../../assets/icons/footer/instargram.png";
import blogIcon from "../../../assets/icons/footer/blog.png";

function IntroFooter() {
    return (
        <footer className="footer">
            <div className="footer-top">
                <div className="footer-brand">
                    <h3>Petmate</h3>
                    <p>반려동물을 위한 올인원 케어 플랫폼</p>
                    <p>경기 광명시 양지로 17</p>

                    <div className="footer-social">
                        <a href="#none"><img src={facebookIcon} alt="Facebook" /></a>
                        <a href="#none"><img src={twitterIcon} alt="Twitter" /></a>
                        <a href="#none"><img src={instargramIcon} alt="Instargram" /></a>
                        <a href="#none"><img src={blogIcon} alt="Blog" /></a>
                    </div>

                    <p className="footer-tel">1577-1013</p>

                </div>

                <div className="footer-links">
                    <div>
                        <h4>Petmate</h4>
                        <ul>
                            <li><a href="#none">이용약관</a></li>
                            <li><a href="#none">개인정보처리방침</a></li>
                            <li><a href="#none">저작권보호정책</a></li>
                            <li><a href="#none">운영관리 방침</a></li>
                            <li><a href="#none">이메일주소 무단수집 거부</a></li>
                        </ul>
                    </div>
                
                <div>
                    <h4>서비스 소개</h4>
                    <ul>
                        <li><a href="#none">이용 후기</a></li>
                        <li><a href="#none">예약 절차</a></li>
                        <li><a href="#none">고객센터</a></li>
                    </ul>
                </div>
              </div>
            </div>

            <div className="footer-middle">
                간편한 통합 예약 시스템으로 반려동물과의 더 나은 라이프스타일 제공<br />
                우리는 유기동물을 응원합니다. 수익금 일부는 한국유기동물복지협회에 기부됩니다.
            </div>

            <div className="footer-bottom">
                © 2025 Petmate. All Rights Reserved.
            </div>
        </footer>
    );
}

export default IntroFooter;