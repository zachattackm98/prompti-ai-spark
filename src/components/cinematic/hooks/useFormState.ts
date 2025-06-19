
import { useCinematicFormState } from './useCinematicFormState';
import { useSimplifiedMultiSceneState } from './useSimplifiedMultiSceneState';

export const useFormState = () => {
  const formState = useCinematicFormState();
  const multiSceneState = useSimplifiedMultiSceneState();

  const resetForm = () => {
    formState.resetForm();
    multiSceneState.resetProject();
  };

  return {
    ...formState,
    ...multiSceneState,
    resetForm
  };
};
