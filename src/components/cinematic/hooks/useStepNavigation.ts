
import { scrollToElementById } from '@/utils/scrollUtils';

export const useStepNavigation = (
  currentStep: number,
  setCurrentStep: (step: number) => void,
  canUseFeature: (feature: string) => boolean
) => {
  const getTotalSteps = () => {
    let steps = 5; // Scene, Platform, Dialog, Sound, Style (base steps)
    if (canUseFeature('cameraControls')) steps++;
    if (canUseFeature('lightingOptions')) steps++;
    return steps;
  };

  const totalSteps = getTotalSteps();

  const scrollToForm = () => {
    // Small delay to allow step transition to complete
    setTimeout(() => {
      scrollToElementById('cinematic-form-container');
    }, 100);
  };

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
      scrollToForm();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      scrollToForm();
    }
  };

  return {
    totalSteps,
    handleNext,
    handlePrevious,
    scrollToForm
  };
};
