import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Panel({
  title,
  children,
  defaultOpen = true,
  color = "border-brand-muted",
  fixedWidth, 
}) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div
      className={`bg-brand-gray/90 rounded-2xl shadow-lg border ${color} overflow-hidden w-full flex flex-col items-center`}
      style={fixedWidth ? { width: fixedWidth } : {}}
    >
      <div
        className="flex justify-between items-center w-full p-4 cursor-pointer hover:bg-brand-gray/80"
        onClick={() => setOpen(!open)}
      >
        <h3 className="font-heading text-lg text-brand-light">{title}</h3>
        <motion.button
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.3 }}
        >
          ▼
        </motion.button>
      </div>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="panel-content"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="w-full h-auto flex flex-col items-center p-4"
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
