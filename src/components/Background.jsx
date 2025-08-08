import React from "react";

const Background = ({ image = "/bg.jpg", blur = 1, children }) => {
  return (
    <div className="relative min-h-screen overflow-hidden text-light">
      <div
        className="fixed top-0 left-0 w-full h-full bg-cover bg-center z-0"
        style={{
          backgroundImage: `url('${image}')`,
          filter: `blur(${blur}px)`,
        }}
      />

      <div className="relative z-10 bg-black bg-opacity-60 min-h-screen">
        {children}
      </div>
    </div>
  );
};

export default Background;
