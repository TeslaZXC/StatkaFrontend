import React from "react";

const Loader = () => (
  <div className="flex justify-center items-center h-60">
    <div className="w-32 h-32 animate-spin-3d">
      <img
        src="/loader-image.png" 
        alt="loading"
        className="w-full h-full object-cover rounded-full"
      />
    </div>

    <style jsx>{`
      @keyframes spin-3d {
        0% {
          transform: rotateY(0deg) rotateX(0deg);
        }
        100% {
          transform: rotateY(360deg) rotateX(360deg);
        }
      }

      .animate-spin-3d {
        animation: spin-3d 2s linear infinite;
        transform-style: preserve-3d;
        perspective: 1000px;
      }
    `}</style>
  </div>
);

export default Loader;
