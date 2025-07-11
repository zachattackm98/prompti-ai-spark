
export const scrollToTop = (behavior: 'smooth' | 'instant' = 'smooth') => {
  window.scrollTo({
    top: 0,
    left: 0,
    behavior
  });
};

export const scrollToElement = (element: HTMLElement | null, behavior: 'smooth' | 'instant' = 'smooth', offset: number = 0) => {
  if (!element) {
    console.log('ScrollUtils: Element not found');
    return;
  }
  
  const elementTop = element.offsetTop - offset;
  console.log(`ScrollUtils: Scrolling to element at ${elementTop}px (offset: ${offset}px)`);
  
  window.scrollTo({
    top: elementTop,
    left: 0,
    behavior
  });
};

export const scrollToElementById = (elementId: string, behavior: 'smooth' | 'instant' = 'smooth', offset: number = 120) => {
  console.log(`ScrollUtils: Looking for element with ID: ${elementId}`);
  const element = document.getElementById(elementId);
  
  if (!element) {
    console.warn(`ScrollUtils: Element with ID '${elementId}' not found`);
    return;
  }
  
  scrollToElement(element, behavior, offset);
};

export const scrollToStepContent = (stepNumber: number, behavior: 'smooth' | 'instant' = 'smooth') => {
  const stepId = `step-content-${stepNumber}`;
  console.log(`ScrollUtils: Scrolling to step content: ${stepId}`);
  
  // Use a more centered approach for better user experience
  const element = document.getElementById(stepId);
  if (element) {
    element.scrollIntoView({ 
      behavior, 
      block: 'center',
      inline: 'nearest' 
    });
  } else {
    // Fallback to form container with larger offset
    console.log('ScrollUtils: Step content not found, falling back to form container');
    scrollToElementById('cinematic-form-container', behavior, 150);
  }
};
