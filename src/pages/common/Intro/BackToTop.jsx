import "./BackToTop.css";

function BackToTop({ visible }) {
  if (!visible) return null; 

  const scrollToTop = () => {
    if (window.fullpage_api) {
      window.fullpage_api.moveTo("intro");
    }
  };

  return (
    <button className="back-to-top" onClick={scrollToTop}>
      ↑
    </button>
  );
}

export default BackToTop;
