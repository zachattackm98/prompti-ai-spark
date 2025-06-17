
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

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  return {
    totalSteps,
    handleNext,
    handlePrevious
  };
};
