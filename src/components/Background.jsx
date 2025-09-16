import { useState, useEffect } from "react";
import bgImage from "../assets/background.jpg";

function Background({ enableCursorEffect = true }) {
  const [pos, setPos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (!enableCursorEffect) return;
    const handleMouseMove = (e) => setPos({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [enableCursorEffect]);

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      <img
        src={bgImage}
        alt="Background"
        className="w-full h-full object-cover filter blur-lg"
      />
    </div>
  );
}

export default Background;
