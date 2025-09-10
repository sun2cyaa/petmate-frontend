import React from "react";
import "../styles/SectionTitle.css";

const SectionTitle = ({ title, subtitle, center }) => {
  return (
    <div className={`section-title ${center ? 'center' : ''}`}>
      <h2 className="section-title-main">{title}</h2>
      {subtitle && <p className="section-title-sub">{subtitle}</p>}
    </div>
  );
};

export default SectionTitle;
