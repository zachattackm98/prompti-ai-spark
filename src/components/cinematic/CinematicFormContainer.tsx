
import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useSubscription } from '@/hooks/useSubscription';
import { createSubscriptionHelpers } from '@/hooks/subscription/subscriptionHelpers';
import { useCinematicForm } from './useCinematicForm';
import { usePromptHistory } from '@/hooks/usePromptHistory';
import { useHistoryScenes } from './hooks/useHistoryScenes';
import { CinematicFormProvider } from './CinematicFormProvider';
import CinematicFormLayout from './CinematicFormLayout';

interface CinematicFormContainerProps {
  setShowAuthDialog: (show: boolean) => void;
  onUpgrade: () => void;
  showHistory?: boolean;
}

const CinematicFormContainer: React.FC<CinematicFormContainerProps> = ({ 
  setShowAuthDialog, 
  onUpgrade,
  showHistory = false
}) => {
  const { user } = useAuth();
  const { subscription } = useSubscription();
  const subscriptionHelpers = createSubscriptionHelpers(subscription);
  const { loadPromptHistory } = usePromptHistory();

  const cinematicFormState = useCinematicForm(
    user,
    subscription,
    subscriptionHelpers.canUseFeature,
    setShowAuthDialog,
    loadPromptHistory
  );

  const { createScenesFromHistory } = useHistoryScenes(
    cinematicFormState.startNewProject,
    cinematicFormState.loadSceneDataToCurrentState,
    cinematicFormState.setCurrentStep
  );

  const contextValue = {
    ...cinematicFormState,
    canUseFeature: subscriptionHelpers.canUseFeature,
    features: subscriptionHelpers.features,
    setShowAuthDialog,
    user,
    subscription
  };

  return (
    <CinematicFormProvider value={contextValue}>
      <CinematicFormLayout
        showHistory={showHistory}
        onCreateScenesFromHistory={createScenesFromHistory}
        onUpgrade={onUpgrade}
      />
    </CinematicFormProvider>
  );
};

export default CinematicFormContainer;
