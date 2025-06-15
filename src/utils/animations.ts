
// Optimized animation configurations for consistent performance
export const animationConfig = {
  duration: 0.6,
  ease: [0.25, 0.8, 0.25, 1] as const,
};

// Smooth fade variants with optimized timing
export const fadeInVariants = {
  hidden: { 
    opacity: 0, 
    y: 20,
    transition: {
      duration: 0.4,
      ease: [0.25, 0.8, 0.25, 1] as const
    }
  },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.25, 0.8, 0.25, 1] as const
    }
  }
};

// Optimized stagger container with reduced delays
export const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
      duration: 0.6,
      ease: [0.25, 0.8, 0.25, 1] as const
    }
  }
};

// Smooth scale variants
export const scaleInVariants = {
  hidden: { 
    scale: 0.95, 
    opacity: 0,
    transition: {
      duration: 0.4,
      ease: [0.25, 0.8, 0.25, 1] as const
    }
  },
  visible: { 
    scale: 1, 
    opacity: 1,
    transition: {
      duration: 0.6,
      ease: [0.25, 0.8, 0.25, 1] as const
    }
  }
};

// Optimized slide variants
export const slideInVariants = {
  hidden: { 
    x: -20, 
    opacity: 0,
    transition: {
      duration: 0.4,
      ease: [0.25, 0.8, 0.25, 1] as const
    }
  },
  visible: { 
    x: 0, 
    opacity: 1,
    transition: {
      duration: 0.6,
      ease: [0.25, 0.8, 0.25, 1] as const
    }
  }
};

// Card variants for components
export const cardVariants = {
  hidden: { 
    opacity: 0, 
    y: 20,
    transition: {
      duration: 0.4,
      ease: [0.25, 0.8, 0.25, 1] as const
    }
  },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.25, 0.8, 0.25, 1] as const
    }
  }
};

// New smooth logo variants for social proof
export const logoVariants = {
  hidden: { 
    opacity: 0, 
    scale: 0.9,
    transition: {
      duration: 0.3,
      ease: [0.25, 0.8, 0.25, 1] as const
    }
  },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: {
      duration: 0.5,
      ease: [0.25, 0.8, 0.25, 1] as const
    }
  }
};

// Optimized viewport options
export const viewportOptions = {
  once: true,
  margin: "-10% 0px -10% 0px",
  amount: 0.1
};

// Performance optimized viewport for above-fold content
export const immediateViewport = {
  once: true,
  margin: "0px 0px 0px 0px",
  amount: 0
};
