import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export function PageTransition({ children, pageKey, transitionType = 'flip' }) {
  const useSlideUp = transitionType === 'slide-up';
  
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={pageKey}
        initial={useSlideUp ? {
          y: "100%",
          opacity: 0,
        } : {
          rotateY: -90,
          opacity: 0,
          transformOrigin: "left center",
        }}
        animate={useSlideUp ? {
          y: 0,
          opacity: 1,
        } : {
          rotateY: 0,
          opacity: 1,
          transformOrigin: "left center",
        }}
        exit={useSlideUp ? {
          y: "-100%",
          opacity: 0,
        } : {
          rotateY: 90,
          opacity: 0,
          transformOrigin: "right center",
        }}
        transition={{
          duration: 0.8,
          ease: [0.4, 0, 0.2, 1],
        }}
        style={useSlideUp ? {} : {
          perspective: "2000px",
          transformStyle: "preserve-3d",
        }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
