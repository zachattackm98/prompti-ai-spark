
import { scrollToStepContent, scrollToElementById } from '@/utils/scrollUtils';

export const useStepNavigation = (
  currentStep: number,
  setCurrentStep: (step: number) => void,
  canUseFeature: (feature: string) => boolean
) => {
  // Always return 7 steps - all users can see all steps now
  const totalSteps = 7;

  const scrollToForm = () => {
    // Small delay to allow step transition to complete
    setTimeout(() => {
      console.log(`StepNavigation: Scrolling to step ${currentStep}`);
      scrollToStepContent(currentStep);
    }, 150);
  };

  const handleNext = () => {
    if (currentStep < totalSteps) {
      const nextStep = currentStep + 1;
      setCurrentStep(nextStep);
      
      // Scroll to the new step after state update
      setTimeout(() => {
        console.log(`StepNavigation: Moving to step ${nextStep}`);
        scrollToStepContent(nextStep);
      }, 200);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      const prevStep = currentStep - 1;
      setCurrentStep(prevStep);
      
      // Scroll to the new step after state update
      setTimeout(() => {
        console.log(`StepNavigation: Moving to step ${prevStep}`);
        scrollToStepContent(prevStep);
      }, 200);
    }
  };

  return {
    totalSteps,
    handleNext,
    handlePrevious,
    scrollToForm
  };
};
