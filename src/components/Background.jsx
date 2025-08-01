import React from "react";

const Background = ({ image = "/bg.jpg", blur = 20, children }) => {
  return (
    <div className="relative min-h-screen overflow-hidden text-light">
      <div
        className="absolute inset-0 bg-cover bg-center scale-110"
        style={{
          backgroundImage: `url('${image}')`,
          filter: `blur(${blur}px)`,
          transition: "filter 0.3s ease",
        }}
      />

      <div className="relative z-10 bg-black bg-opacity-60 min-h-screen">
        {children}
      </div>
    </div>
  );
};

export default Background;
