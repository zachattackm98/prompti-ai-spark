
import { scrollToStepContent } from '@/utils/scrollUtils';

export const useCinematicActions = (
  setCurrentStep: (step: number) => void,
  resetForm: () => void,
  totalSteps: number
) => {
  const handleGenerateNew = () => {
    // Only reset form state to step 1, but preserve any generated prompts
    setCurrentStep(1);
    // Scroll to the first step after reset with a delay to allow state update
    setTimeout(() => {
      console.log('useCinematicForm: Scrolling to step 1 after reset');
      scrollToStepContent(1);
    }, 200);
  };

  return {
    handleGenerateNew
  };
};
