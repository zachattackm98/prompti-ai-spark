
export const scrollToTop = (behavior: 'smooth' | 'instant' = 'smooth') => {
  window.scrollTo({
    top: 0,
    left: 0,
    behavior
  });
};

export const scrollToElement = (element: HTMLElement | null, behavior: 'smooth' | 'instant' = 'smooth', offset: number = 0) => {
  if (!element) return;
  
  const elementTop = element.offsetTop - offset;
  window.scrollTo({
    top: elementTop,
    left: 0,
    behavior
  });
};

export const scrollToElementById = (elementId: string, behavior: 'smooth' | 'instant' = 'smooth', offset: number = 100) => {
  const element = document.getElementById(elementId);
  scrollToElement(element, behavior, offset);
};
