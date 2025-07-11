import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Film, Plus, Sparkles, ArrowRight, Lightbulb, Users, MapPin } from 'lucide-react';
import { GeneratedPrompt, SceneData } from './hooks/types';
import { buildEnhancedSceneContext, extractContextFromScene, generateSceneSuggestions, ExtractedContext } from './utils/contextExtractor';

interface StreamlinedContinuationProps {
  generatedPrompt: GeneratedPrompt;
  onContinueScene: (projectTitle: string, nextSceneIdea: string) => void;
  onStartOver: () => void;
  isLoading?: boolean;
  currentScenes?: SceneData[];
}

const StreamlinedContinuation: React.FC<StreamlinedContinuationProps> = ({
  generatedPrompt,
  onContinueScene,
  onStartOver,
  isLoading = false,
  currentScenes = []
}) => {
  const [projectTitle, setProjectTitle] = useState('');
  const [nextSceneIdea, setNextSceneIdea] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [extractedContext, setExtractedContext] = useState<ExtractedContext | null>(null);
  const [suggestions, setSuggestions] = useState<string[]>([]);

  // Auto-generate project title and analyze context
  useEffect(() => {
    if (generatedPrompt?.mainPrompt) {
      // Create a mock scene for context extraction
      const mockScene: SceneData = {
        sceneNumber: 1,
        sceneIdea: '',
        selectedPlatform: generatedPrompt.platform,
        selectedEmotion: 'dramatic',
        dialogSettings: { hasDialog: false, dialogType: '', dialogStyle: '', language: '' },
        soundSettings: { hasSound: false },
        cameraSettings: { angle: '', movement: '', shot: '' },
        lightingSettings: { mood: '', style: '', timeOfDay: '' },
        styleReference: '',
        generatedPrompt
      };

      const context = extractContextFromScene(mockScene);
      setExtractedContext(context);

      // Generate intelligent suggestions
      const sceneSuggestions = generateSceneSuggestions([context]);
      setSuggestions(sceneSuggestions);

      // Auto-generate project title from context
      if (!projectTitle) {
        generateProjectTitle(context);
      }
    }
  }, [generatedPrompt, projectTitle]);

  const generateProjectTitle = (context: ExtractedContext) => {
    const titles = [
      'Cinematic Story',
      'Visual Narrative',
      'Scene Sequence',
      'Story Arc',
      'Character Journey'
    ];
    
    // Try to create a more intelligent title based on context
    if (context.characters.length > 0) {
      const character = context.characters[0].split(' ').slice(0, 2).join(' ');
      setProjectTitle(`${character} Chronicles`);
    } else if (context.locations.length > 0) {
      const location = context.locations[0].split(' ').slice(0, 2).join(' ');
      setProjectTitle(`The ${location} Story`);
    } else {
      setProjectTitle(titles[Math.floor(Math.random() * titles.length)]);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setNextSceneIdea(suggestion);
  };

  const handleQuickContinue = () => {
    if (suggestions.length > 0) {
      const defaultIdea = suggestions[0];
      onContinueScene(projectTitle, defaultIdea);
    } else {
      setShowForm(true);
    }
  };

  const handleCustomContinue = () => {
    if (!projectTitle.trim() || !nextSceneIdea.trim()) return;
    onContinueScene(projectTitle, nextSceneIdea);
  };

  if (!showForm) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-6 space-y-4"
      >
        {/* Context Summary Card */}
        {extractedContext && (
          <Card className="bg-gradient-to-r from-slate-900/80 to-purple-900/20 border border-purple-400/20 p-4">
            <div className="space-y-3">
              <h4 className="text-sm font-semibold text-purple-300 flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                Scene Context Detected
              </h4>
              
              <div className="flex flex-wrap gap-2">
                {extractedContext.characters.length > 0 && (
                  <Badge variant="outline" className="text-xs border-blue-400/30 text-blue-300">
                    <Users className="w-3 h-3 mr-1" />
                    {extractedContext.characters.length} Character{extractedContext.characters.length > 1 ? 's' : ''}
                  </Badge>
                )}
                {extractedContext.locations.length > 0 && (
                  <Badge variant="outline" className="text-xs border-green-400/30 text-green-300">
                    <MapPin className="w-3 h-3 mr-1" />
                    {extractedContext.locations.length} Location{extractedContext.locations.length > 1 ? 's' : ''}
                  </Badge>
                )}
                {extractedContext.mood && (
                  <Badge variant="outline" className="text-xs border-purple-400/30 text-purple-300">
                    {extractedContext.mood} mood
                  </Badge>
                )}
              </div>
            </div>
          </Card>
        )}

        {/* Main Action Card */}
        <Card className="bg-gradient-to-r from-purple-900/30 to-pink-900/30 border border-purple-400/30 p-6">
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center gap-2 text-purple-300">
              <Sparkles className="w-5 h-5" />
              <h3 className="text-lg font-semibold">Continue Your Story</h3>
              <Sparkles className="w-5 h-5" />
            </div>
            
            <p className="text-white text-base font-semibold bg-gradient-to-r from-purple-100 to-pink-100 bg-clip-text text-transparent">
              AI detected story elements for automatic continuity. Continue with Scene 2 while maintaining character consistency and narrative flow.
            </p>

            {/* Intelligent Suggestions */}
            {suggestions.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center justify-center gap-2 text-sm text-purple-300">
                  <Lightbulb className="w-4 h-4" />
                  <span>Smart Continuation Ideas</span>
                </div>
                
                <div className="space-y-2">
                  {suggestions.slice(0, 2).map((suggestion, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      onClick={() => {
                        setNextSceneIdea(suggestion);
                        setShowForm(true);
                      }}
                      className="w-full text-left justify-start text-sm border-purple-400/30 text-purple-200 hover:bg-purple-900/30 hover:text-white bg-slate-800/40"
                    >
                      <ArrowRight className="w-3 h-3 mr-2 flex-shrink-0" />
                      <span className="truncate">{suggestion}</span>
                    </Button>
                  ))}
                </div>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
              <Button
                onClick={handleQuickContinue}
                disabled={isLoading}
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
              >
                <Film className="w-4 h-4 mr-2" />
                {isLoading ? 'Processing...' : 'Quick Continue'}
              </Button>
              
              <Button
                onClick={() => setShowForm(true)}
                variant="outline"
                className="border-purple-400/50 text-purple-200 hover:bg-purple-900/30 hover:text-white bg-slate-800/60"
              >
                <Plus className="w-4 h-4 mr-2" />
                Custom Scene
              </Button>
              
              <Button
                onClick={onStartOver}
                variant="outline"
                className="border-slate-600 text-slate-300 hover:bg-slate-700 bg-slate-800/60"
              >
                New Project
              </Button>
            </div>
          </div>
        </Card>
      </motion.div>
    );
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="mt-6"
      >
        <Card className="bg-gradient-to-br from-slate-900/80 to-purple-900/30 border border-purple-400/30 p-6">
          <div className="space-y-4">
            <div className="text-center">
              <h3 className="text-xl font-bold text-white mb-2">Create Scene 2</h3>
              <p className="text-gray-300 text-sm">
                AI will maintain character and setting continuity automatically
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-purple-300 text-sm font-medium block mb-2">
                  Project Title
                </label>
                <Input
                  value={projectTitle}
                  onChange={(e) => setProjectTitle(e.target.value)}
                  placeholder="e.g., The Heist Chronicles"
                  className="bg-slate-800/60 border-purple-400/30 text-white"
                />
              </div>

              <div>
                <label className="text-purple-300 text-sm font-medium block mb-2">
                  Scene 2 Idea
                </label>
                <div className="space-y-2">
                  <Input
                    value={nextSceneIdea}
                    onChange={(e) => setNextSceneIdea(e.target.value)}
                    placeholder="What happens next in your story..."
                    className="bg-slate-800/60 border-purple-400/30 text-white"
                  />
                  
                  {/* Quick suggestion buttons */}
                  {suggestions.length > 0 && !nextSceneIdea && (
                    <div className="flex flex-wrap gap-2">
                      {suggestions.map((suggestion, index) => (
                        <Button
                          key={index}
                          variant="outline"
                          size="sm"
                          onClick={() => handleSuggestionClick(suggestion)}
                          className="text-xs border-purple-400/30 text-purple-200 hover:bg-purple-900/30 hover:text-white bg-slate-800/40"
                        >
                          {suggestion}
                        </Button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="flex gap-3 justify-center pt-4">
              <Button
                onClick={handleCustomContinue}
                disabled={!projectTitle.trim() || !nextSceneIdea.trim() || isLoading}
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
              >
                {isLoading ? (
                  <>Processing...</>
                ) : (
                  <>
                    <Film className="w-4 h-4 mr-2" />
                    Create Scene 2
                  </>
                )}
              </Button>
              
              <Button
                onClick={() => setShowForm(false)}
                variant="outline"
                className="border-purple-400/30 text-purple-200 hover:bg-purple-900/30 hover:text-white bg-slate-800/60"
              >
                Back
              </Button>
            </div>
          </div>
        </Card>
      </motion.div>
    </AnimatePresence>
  );
};

export default StreamlinedContinuation;