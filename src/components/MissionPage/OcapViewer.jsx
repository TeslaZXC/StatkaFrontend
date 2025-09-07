import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function OcapViewer({ defaultOpen = true, link }) {
  const [expanded, setExpanded] = useState(defaultOpen);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    if (defaultOpen) setExpanded(true);
  }, [defaultOpen]);

  useEffect(() => {
    if (link) setExpanded(true);
  }, [link]);

  if (!link) return null;

  return (
    <>
      <AnimatePresence>
        {isFullscreen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex justify-center items-center bg-black/60"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-brand-gray/90 rounded-2xl shadow-lg overflow-hidden border border-brand-muted flex flex-col w-full max-w-[1600px] h-full"
            >
              <div className="flex justify-between items-center p-4 bg-brand-gray/90">
                <h3 className="font-heading text-lg text-brand-light">OCAP Viewer</h3>
                <button
                  onClick={() => setIsFullscreen(false)}
                  className="px-2 py-1 bg-brand-red text-white rounded hover:bg-red-700 text-xs"
                >
                  ✕ Закрыть
                </button>
              </div>
              <iframe key={link} src={link} title="OCAP Viewer" className="w-full flex-1 border-0" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex justify-center my-6">
        <div className="bg-brand-gray/90 rounded-2xl shadow-lg overflow-hidden border border-brand-muted flex flex-col w-full max-w-[1600px]">
          <div
            className="flex justify-between items-center p-4 cursor-pointer hover:bg-brand-gray/80"
            onClick={() => setExpanded(!expanded)}
          >
            <h3 className="font-heading text-lg text-brand-light">OCAP Viewer</h3>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsFullscreen(true);
              }}
              className="px-2 py-1 bg-brand-gray text-brand-light rounded hover:bg-brand-gray/70 text-xs"
            >
              ⛶ Во весь экран
            </button>
          </div>
          <AnimatePresence>
            {expanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 700, opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden flex flex-col w-full"
              >
                <iframe key={link} src={link} title="OCAP Viewer" className="w-full flex-1 border-0" />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </>
  );
}
