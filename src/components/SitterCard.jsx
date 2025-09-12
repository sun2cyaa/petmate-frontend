import React from "react";
import "../styles/SitterCard.css";
import { FaHeart } from "react-icons/fa";
import { styleEffect } from "framer-motion";

const SitterCard = ({ sitter }) => {
  return (
    <div className="sitter-card">
      {/* 이미지 & 뱃지 */}
      <div className="sitter-image-container">
        <img src={sitter.img} alt={sitter.name} className="sitter-image" />
        {sitter.isVerified && <div className="verified-badge">인증완료</div>}
        <div className="distance-badge">{sitter.distance}</div>
      </div>

      {/* 내용 */}
      <div className="sitter-content">
        <div className="sitter-header">
          <h3 className="sitter-name">{sitter.name}</h3>
          <div className="sitter-rating">
            {[...Array(5)].map((_, i) => (
              <FaHeart
                key={i}
                color={i < Math.round(sitter.rating) ? "#eb4b4b" : "#ddd"}
                style={{ marginRight: "3px" }}
              />
            ))}
            <span className="rating-score">{sitter.rating.toFixed(1)}</span>
            <span className="rating-count">({sitter.reviews})</span>
          </div>
        </div>

        <p className="sitter-desc">{sitter.desc}</p>

        {/* 태그 */}
        <div className="sitter-tags">
          {sitter.tags.map((tag, index) => (
            <span key={index} className="sitter-tag">#{tag}</span>
          ))}
        </div>

        {/* 가격 & 버튼 */}
        <div className="sitter-footer">
          <div>
            <div className="sitter-price">{sitter.price}</div>
            <div className="response-time">{sitter.responseTime}</div>
          </div>
          <button className="reserve-btn">예약하기</button>
        </div>
      </div>
    </div>
  );
};

export default SitterCard;
