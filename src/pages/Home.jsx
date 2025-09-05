import AnimatedText from "../components/AnimatedText";
import { motion } from "framer-motion";

function Home() {
  return (
    <div className="relative flex items-center justify-center h-screen text-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="text-brand-light z-10"
      >
        <AnimatedText text="STATKA - ЛУЧШАЯ СТАТИСТИКА RB   " />
        <motion.h2
          className="text-lg max-w-xl mx-auto text-brand-muted font-sans mt-4"
          initial={{ scale: 1 }}
          whileHover={{ scale: 1.02 }} 
          transition={{ type: "spring", stiffness: 200 }}
        >
        
        </motion.h2>
      </motion.div>
    </div>
  );
}

export default Home;
