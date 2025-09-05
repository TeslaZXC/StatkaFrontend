import { motion } from "framer-motion";

function AnimatedText({ text }) {
  return (
    <h2 className="text-5xl font-bold mb-6 font-heading flex flex-wrap justify-center gap-1">
      {text.split("").map((char, index) => {
        if (char === " ") return <span key={index} className="w-2">&nbsp;</span>;
        return (
          <motion.span
            key={index}
            className="inline-block"
            whileHover={{ scale: 1.5, color: "#bf1f14" }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            {char}
          </motion.span>
        );
      })}
    </h2>
  );
}

export default AnimatedText;
