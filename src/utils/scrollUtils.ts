
export const scrollToTop = (behavior: 'smooth' | 'instant' = 'smooth') => {
  window.scrollTo({
    top: 0,
    left: 0,
    behavior
  });
};
