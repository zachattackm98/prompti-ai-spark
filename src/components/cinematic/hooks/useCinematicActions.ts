
import { scrollToStepContent } from '@/utils/scrollUtils';

export const useCinematicActions = (
  setCurrentStep: (step: number) => void,
  resetForm: () => void,
  totalSteps: number
) => {
  const handleGenerateNew = () => {
    // Reset the entire form state including generated prompt
    resetForm();
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
