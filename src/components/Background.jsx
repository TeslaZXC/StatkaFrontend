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

      {enableCursorEffect && (
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            maskImage: `radial-gradient(circle 100px at ${pos.x}px ${pos.y}px, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 100%)`,
            WebkitMaskImage: `radial-gradient(circle 100px at ${pos.x}px ${pos.y}px, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 100%)`,
            maskRepeat: "no-repeat",
            WebkitMaskRepeat: "no-repeat",
            backgroundImage: `url(${bgImage})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            filter: "blur(0px)", 
          }}
        />
      )}
    </div>
  );
}

export default Background;
