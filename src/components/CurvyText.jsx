import React from 'react';
import { motion } from 'framer-motion';

// Component for the animated, curvy text banner separator
export function CurvyText({ text, color = 'var(--color-green-accent)', textColor = 'var(--color-text-dark)', reverse = false }) {
  // Repeat text many times to ensure continuous marquee effect
  const repeatedText = Array(20).fill(text).join(' '); 
  
  const marqueeVariants = {
    animate: {
      // Moves the text horizontally. Reverse direction if `reverse` is true.
      x: [0, reverse ? -1000 : 1000], 
      transition: {
        x: {
          repeat: Infinity,
          repeatType: "loop",
          duration: 15, // Speed of animation
          ease: "linear",
        },
      },
    },
  };

  return (
    <div className="curvy-text-container" style={{ backgroundColor: color }}>
      {/* Note: The wave effect is primarily achieved through CSS in Home.css 
          and the animation from framer-motion in curvy-text-content */}
      
      <motion.div
        className="curvy-text-content"
        variants={marqueeVariants}
        animate="animate"
        style={{ color: textColor }}
      >
        {repeatedText}
      </motion.div>
    </div>
  );
}