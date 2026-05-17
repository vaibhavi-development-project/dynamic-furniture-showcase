import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function IntroLoader() {
  const [show, setShow] = useState(true);
  useEffect(() => {
    if (sessionStorage.getItem("maisonor.intro")) { setShow(false); return; }
    const t = setTimeout(() => {
      setShow(false);
      sessionStorage.setItem("maisonor.intro", "1");
    }, 1800);
    return () => clearTimeout(t);
  }, []);
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-background"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          <motion.div
            initial={{ opacity: 0, letterSpacing: "0.5em" }}
            animate={{ opacity: 1, letterSpacing: "0.2em" }}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
            className="font-display text-4xl md:text-6xl"
          >
            Maison<span className="text-gradient-gold">Or</span>
          </motion.div>
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1] }}
            className="absolute bottom-1/3 h-px w-40 bg-gradient-to-r from-transparent via-primary to-transparent origin-left"
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
