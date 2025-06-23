
import { scrollToStepContent } from '@/utils/scrollUtils';

export const useCinematicActions = (
  setCurrentStep: (step: number) => void,
  resetForm: () => void,
  totalSteps: number
) => {
  const handleGenerateNew = () => {
    console.log('useCinematicActions: Starting complete reset for new generation');
    
    // Reset the entire form state including generated prompt and multi-scene project
    resetForm();
    
    // Scroll to the first step after reset with a delay to allow state update
    setTimeout(() => {
      console.log('useCinematicActions: Scrolling to step 1 after complete reset');
      scrollToStepContent(1);
    }, 200);
  };

  return {
    handleGenerateNew
  };
};
