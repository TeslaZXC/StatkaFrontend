import React from "react";

const updateText = `я на море был`;

const Updates = () => {
  return (
    <section
      className="max-w-3xl mx-auto p-6 w-full mt-12 text-white
        rounded-lg
        border border-accent
        bg-black/30
        shadow-lg shadow-accent/50
        backdrop-blur-sm
        whitespace-pre-wrap
        font-normal"
    >
      <h2 className="text-3xl font-bold mb-6 text-center lowercase">
        обновления сайта
      </h2>
      <pre className="whitespace-pre-wrap font-sans">{updateText}</pre>
    </section>
  );
};

export default Updates;
