
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Wand2, Plus } from 'lucide-react';

interface FormStep5GenerationProps {
  user: any;
  subscription: any;
  canUseFeature: (feature: string) => boolean;
  setShowAuthDialog: (show: boolean) => void;
  loadPromptHistory: () => void;
  sceneIdea: string;
  selectedPlatform: string;
  selectedEmotion: string;
  dialogSettings: any;
  soundSettings: any;
  cameraSettings: any;
  lightingSettings: any;
  styleReference: string;
  generatedPrompt: any;
  isLoading: boolean;
  isMultiScene?: boolean;
  currentProject?: any;
  setGeneratedPrompt: (prompt: any) => void;
  setIsLoading: (loading: boolean) => void;
  handleGenerateNew: () => void;
  handleContinueScene?: () => void;
  updateScenePrompt?: (sceneIndex: number, prompt: any) => Promise<any>;
  onPrevious: () => void;
}

const FormStep5Generation: React.FC<FormStep5GenerationProps> = ({
  user,
  subscription,
  canUseFeature,
  setShowAuthDialog,
  loadPromptHistory,
  sceneIdea,
  selectedPlatform,
  selectedEmotion,
  dialogSettings,
  soundSettings,
  cameraSettings,
  lightingSettings,
  styleReference,
  generatedPrompt,
  isLoading,
  isMultiScene,
  currentProject,
  setGeneratedPrompt,
  setIsLoading,
  handleGenerateNew,
  handleContinueScene,
  updateScenePrompt,
  onPrevious
}) => {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-white mb-2">Generate Your Prompt</h2>
        <p className="text-gray-400">
          {isMultiScene 
            ? 'Add this scene to your project'
            : 'Create your cinematic prompt'
          }
        </p>
      </div>

      {/* Scene Summary */}
      <div className="p-4 bg-slate-800/50 rounded-lg">
        <h3 className="text-white font-medium mb-2">Scene Summary</h3>
        <div className="space-y-2 text-sm">
          <p><span className="text-gray-400">Platform:</span> <span className="text-white">{selectedPlatform}</span></p>
          <p><span className="text-gray-400">Emotion:</span> <span className="text-white">{selectedEmotion}</span></p>
          <p><span className="text-gray-400">Scene:</span> <span className="text-white">{sceneIdea}</span></p>
        </div>
      </div>

      {/* Generated Prompt Display */}
      {generatedPrompt && (
        <div className="p-4 bg-slate-800/50 rounded-lg">
          <h3 className="text-white font-medium mb-2">Generated Prompt</h3>
          <div className="text-gray-300 text-sm whitespace-pre-wrap">
            {typeof generatedPrompt === 'string' ? generatedPrompt : JSON.stringify(generatedPrompt, null, 2)}
          </div>
        </div>
      )}

      <div className="flex gap-3">
        <Button onClick={onPrevious} variant="outline" className="flex-1">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Previous
        </Button>
        
        {!generatedPrompt ? (
          <Button
            onClick={handleGenerateNew}
            disabled={isLoading || !user}
            className="flex-1 bg-purple-600 hover:bg-purple-700"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Generating...
              </>
            ) : (
              <>
                <Wand2 className="w-4 h-4 mr-2" />
                Generate Prompt
              </>
            )}
          </Button>
        ) : (
          <div className="flex gap-3 flex-1">
            <Button
              onClick={handleGenerateNew}
              variant="outline"
              disabled={isLoading}
              className="flex-1"
            >
              <Wand2 className="w-4 h-4 mr-2" />
              Regenerate
            </Button>
            
            {isMultiScene && handleContinueScene && (
              <Button
                onClick={handleContinueScene}
                className="flex-1 bg-green-600 hover:bg-green-700"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Scene
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default FormStep5Generation;
