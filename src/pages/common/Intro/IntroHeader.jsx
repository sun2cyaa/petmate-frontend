import { useState, useEffect } from "react";
import "./IntroHeader.css";

function IntroHeader() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50); 
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className={`intro-header ${scrolled ? "scrolled" : ""}`}>
      <h1 className="intro-logo">PetMate</h1>
    </header>
  );
}

export default IntroHeader;
