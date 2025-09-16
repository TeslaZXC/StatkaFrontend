import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function OcapViewer({ link, fixedHeight = "750px" }) {
  const [isFullscreen, setIsFullscreen] = useState(false);

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
              className="bg-brand-gray/90 rounded-2xl shadow-lg overflow-hidden border border-brand-muted flex flex-col w-full h-full max-w-[2100px] max-h-[95vh]"
            >
              <div className="p-4 bg-brand-gray/90 text-center">
                <h3 className="font-heading text-lg text-brand-light">OCAP Viewer</h3>
              </div>

              <iframe
                src={link}
                title="OCAP Viewer"
                className="w-full h-full border-0 flex-1"
              />

              <div className="p-4 flex justify-center">
                <button
                  onClick={() => setIsFullscreen(false)}
                  className="px-4 py-2 bg-brand-red text-white rounded hover:bg-red-700 text-sm"
                >
                  ✕ Закрыть
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="w-full flex justify-center my-6">
        <div
          className="w-full flex flex-col rounded-2xl shadow-lg overflow-hidden border border-brand-muted"
          style={{ height: fixedHeight }}
        >
          <div className="flex justify-end p-2 bg-brand-gray/90">
            <button
              onClick={() => setIsFullscreen(true)}
              className="px-3 py-1 bg-brand-gray text-brand-light rounded hover:bg-brand-gray/70 text-xs"
            >
              ⛶ Во весь экран
            </button>
          </div>

          <div className="w-full h-full">
            <iframe
              src={link}
              title="OCAP Viewer"
              className="w-full h-full border-0"
            />
          </div>
        </div>
      </div>
    </>
  );
}
