
import { scrollToStepContent } from '@/utils/scrollUtils';

export const useStepNavigation = (
  currentStep: number,
  setCurrentStep: (step: number) => void,
  canUseFeature: (feature: string) => boolean,
  totalSteps: number = 7 // Make it dynamic with default
) => {
  const handleNext = () => {
    if (currentStep < totalSteps) {
      const nextStep = currentStep + 1;
      console.log(`useStepNavigation: Moving to step ${nextStep}`);
      setCurrentStep(nextStep);
      
      setTimeout(() => {
        console.log(`useStepNavigation: Scrolling to step ${nextStep} content`);
        scrollToStepContent(nextStep);
      }, 200);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      const prevStep = currentStep - 1;
      console.log(`useStepNavigation: Moving to step ${prevStep}`);
      setCurrentStep(prevStep);
      
      setTimeout(() => {
        console.log(`useStepNavigation: Scrolling to step ${prevStep} content`);
        scrollToStepContent(prevStep);
      }, 200);
    }
  };

  const scrollToForm = () => {
    console.log('useStepNavigation: Scrolling to cinematic form');
    scrollToStepContent(currentStep);
  };

  return {
    totalSteps,
    handleNext,
    handlePrevious,
    scrollToForm
  };
};
