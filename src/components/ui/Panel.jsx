import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Panel({ title, children, defaultOpen = true, color = "border-brand-muted" }) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className={`bg-brand-gray/90 rounded-2xl shadow-lg border ${color} overflow-hidden`}>
      {/* Заголовок с кнопкой сворачивания */}
      <div
        className="flex justify-between items-center p-4 cursor-pointer hover:bg-brand-gray/80"
        onClick={() => setOpen(!open)}
      >
        <h3 className="font-heading text-lg text-brand-light">{title}</h3>
        <button className={`transition-transform duration-300 ${open ? "rotate-180" : "rotate-0"}`}>
          ▼
        </button>
      </div>

      {/* Содержимое с анимацией */}
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="p-4 overflow-x-auto"
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
