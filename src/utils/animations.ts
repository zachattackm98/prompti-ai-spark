
// Optimized animation configurations for consistent performance
export const animationConfig = {
  duration: 0.6,
  ease: [0.25, 0.8, 0.25, 1] as const,
};

export const fadeInVariants = {
  hidden: { 
    opacity: 0, 
    y: 20,
    transition: animationConfig
  },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: animationConfig
  }
};

export const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
      ...animationConfig
    }
  }
};

export const scaleInVariants = {
  hidden: { 
    scale: 0.95, 
    opacity: 0,
    transition: animationConfig
  },
  visible: { 
    scale: 1, 
    opacity: 1,
    transition: animationConfig
  }
};

export const slideInVariants = {
  hidden: { 
    x: -30, 
    opacity: 0,
    transition: animationConfig
  },
  visible: { 
    x: 0, 
    opacity: 1,
    transition: animationConfig
  }
};

// Viewport options for consistent behavior
export const viewportOptions = {
  once: true,
  margin: "-10% 0px -10% 0px"
};
