
import { useStepNavigation } from './useStepNavigation';
import { useCinematicActions } from './useCinematicActions';

export const useCinematicSteps = (
  currentStep: number,
  setCurrentStep: (step: number) => void,
  canUseFeature: (feature: string) => boolean,
  totalSteps: number,
  resetForm: () => void
) => {
  const { handleNext, handlePrevious, scrollToForm } = useStepNavigation(
    currentStep,
    setCurrentStep,
    canUseFeature,
    totalSteps
  );

  const { handleGenerateNew } = useCinematicActions(
    setCurrentStep,
    resetForm,
    totalSteps
  );

  return {
    handleNext,
    handlePrevious,
    scrollToForm,
    handleGenerateNew
  };
};
