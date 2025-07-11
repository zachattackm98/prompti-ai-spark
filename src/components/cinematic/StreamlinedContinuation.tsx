import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Film, Plus, Sparkles, ArrowRight, Lightbulb, Users, MapPin, Clock, Eye, Palette, HelpCircle, Info, Wand2 } from 'lucide-react';
import { GeneratedPrompt, SceneData } from './hooks/types';
import { extractEnhancedContext, generateMetadataBasedSuggestions, EnhancedSceneContext } from './utils/metadataContextExtractor';

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
  const [enhancedContext, setEnhancedContext] = useState<EnhancedSceneContext | null>(null);
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

      // Use new metadata-based context extraction
      const context = extractEnhancedContext([mockScene]);
      setEnhancedContext(context);

      // Generate intelligent suggestions using metadata
      const sceneSuggestions = generateMetadataBasedSuggestions(context);
      setSuggestions(sceneSuggestions);

      // Auto-generate project title from context
      if (!projectTitle) {
        generateProjectTitle(context);
      }
    }
  }, [generatedPrompt, projectTitle]);

  const generateProjectTitle = (context: EnhancedSceneContext) => {
    // Extract keywords from the main prompt for more relevant titles
    const promptWords = generatedPrompt.mainPrompt?.toLowerCase().split(' ') || [];
    const importantWords = promptWords.filter(word => 
      word.length > 3 && 
      !['the', 'and', 'but', 'for', 'are', 'with', 'they', 'this', 'that', 'from', 'have', 'more', 'will', 'been'].includes(word)
    );

    // Smart title generation based on available context
    if (context.characters.primary.length > 0 && context.locations.current) {
      const character = context.characters.primary[0].split(' ')[0];
      const location = context.locations.current.split(' ').slice(0, 2).join(' ');
      setProjectTitle(`${character} at ${location}`);
    } else if (context.characters.primary.length > 0) {
      const character = context.characters.primary[0].split(' ').slice(0, 2).join(' ');
      const suffix = ['Chronicles', 'Journey', 'Story', 'Adventures'][Math.floor(Math.random() * 4)];
      setProjectTitle(`${character} ${suffix}`);
    } else if (context.locations.current !== "Unknown location") {
      const location = context.locations.current.split(' ').slice(0, 2).join(' ');
      const prefix = ['The', 'Return to', 'Escape from', 'Mystery of'][Math.floor(Math.random() * 4)];
      setProjectTitle(`${prefix} ${location}`);
    } else if (importantWords.length > 0) {
      const keyword = importantWords[0];
      const themed = ['The', 'Project', 'Mission', 'Operation'][Math.floor(Math.random() * 4)];
      setProjectTitle(`${themed} ${keyword.charAt(0).toUpperCase() + keyword.slice(1)}`);
    } else if (context.storyProgression.currentMood) {
      const moodTitles = {
        'dramatic': 'Dramatic Tales',
        'mysterious': 'Hidden Secrets',
        'romantic': 'Love Stories',
        'intense': 'High Stakes',
        'uplifting': 'Rising Hope',
        'suspenseful': 'Edge of Tension',
        'serene': 'Peaceful Moments'
      };
      setProjectTitle(moodTitles[context.storyProgression.currentMood as keyof typeof moodTitles] || 'Cinematic Story');
    } else {
      const fallbackTitles = [
        'Untitled Story',
        'New Project',
        'Cinematic Adventure',
        'Visual Tale',
        'Story Sequence'
      ];
      setProjectTitle(fallbackTitles[Math.floor(Math.random() * fallbackTitles.length)]);
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
        {/* Enhanced Context Summary Card */}
        {enhancedContext && (
          <Card className="bg-gradient-to-r from-slate-900/80 to-purple-900/20 border border-purple-400/20 p-4">
            <div className="space-y-3">
              <h4 className="text-sm font-semibold text-purple-300 flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                AI Scene Analysis
              </h4>
              
              {/* Context Details */}
              <div className="space-y-2">
                {/* Characters */}
                {enhancedContext.characters.primary.length > 0 && (
                  <div className="flex items-start gap-2">
                    <Users className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <span className="text-xs text-blue-300 font-medium">Characters:</span>
                      <p className="text-xs text-gray-300 mt-1">
                        {enhancedContext.characters.primary.slice(0, 2).join(', ')}
                        {enhancedContext.characters.primary.length > 2 && ` +${enhancedContext.characters.primary.length - 2} more`}
                      </p>
                    </div>
                  </div>
                )}
                
                {/* Locations */}
                {enhancedContext.locations.current !== "Unknown location" && (
                  <div className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <span className="text-xs text-green-300 font-medium">Location:</span>
                      <p className="text-xs text-gray-300 mt-1">
                        {enhancedContext.locations.current}
                      </p>
                    </div>
                  </div>
                )}

                {/* Visual Elements */}
                <div className="flex flex-wrap gap-2 pt-1">
                  {enhancedContext.storyProgression.currentMood !== "neutral" && (
                    <Badge variant="outline" className="text-xs border-purple-400/30 text-purple-300">
                      <Eye className="w-3 h-3 mr-1" />
                      {enhancedContext.storyProgression.currentMood}
                    </Badge>
                  )}
                  {enhancedContext.timeFlow.currentTimeOfDay !== "day" && (
                    <Badge variant="outline" className="text-xs border-orange-400/30 text-orange-300">
                      <Clock className="w-3 h-3 mr-1" />
                      {enhancedContext.timeFlow.currentTimeOfDay}
                    </Badge>
                  )}
                  {enhancedContext.visualConsistency.style !== "cinematic" && (
                    <Badge variant="outline" className="text-xs border-pink-400/30 text-pink-300">
                      <Palette className="w-3 h-3 mr-1" />
                      {enhancedContext.visualConsistency.style}
                    </Badge>
                  )}
                </div>
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
            
            <div className="space-y-4">
              <p className="text-slate-300 text-sm leading-relaxed">
                Ready to continue your cinematic story? Our AI will automatically maintain character consistency, 
                location continuity, and visual style across scenes.
              </p>

              {/* Enhanced Help Section */}
              <div className="bg-slate-800/40 border border-purple-400/20 rounded-lg p-4">
                <div className="flex items-center gap-2 text-purple-300 mb-2">
                  <Info className="w-4 h-4" />
                  <span className="text-sm font-medium">AI Continuity Features</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-400">
                  <div className="flex items-center gap-2">
                    <Users className="w-3 h-3 text-blue-400" />
                    <span>Character consistency</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3 h-3 text-green-400" />
                    <span>Location continuity</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Palette className="w-3 h-3 text-pink-400" />
                    <span>Visual style matching</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-3 h-3 text-orange-400" />
                    <span>Timeline coherence</span>
                  </div>
                </div>
              </div>

              {/* Intelligent Suggestions */}
              {suggestions.length > 0 && (
                <div className="space-y-3">
                  <div className="flex items-center justify-center gap-2 text-sm text-purple-300">
                    <Wand2 className="w-4 h-4" />
                    <span>AI-Generated Scene Ideas</span>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <HelpCircle className="w-3 h-3 text-purple-400" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="text-xs">These suggestions are tailored to your specific story context</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  
                  <div className="space-y-2">
                    {suggestions.slice(0, 3).map((suggestion, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        onClick={() => {
                          setNextSceneIdea(suggestion);
                          setShowForm(true);
                        }}
                        className="w-full text-left justify-start text-sm border-purple-400/30 text-purple-200 hover:bg-purple-900/30 hover:text-white bg-slate-800/40 p-3 h-auto"
                      >
                        <ArrowRight className="w-3 h-3 mr-2 flex-shrink-0 mt-0.5" />
                        <span className="text-left leading-relaxed">{suggestion}</span>
                      </Button>
                    ))}
                  </div>
                </div>
              )}
            </div>

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

            <div className="space-y-5">
              <div>
                <label className="text-purple-300 text-sm font-medium flex items-center gap-2 mb-3">
                  Project Title
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <HelpCircle className="w-3 h-3 text-purple-400" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="text-xs">Give your multi-scene project a memorable name</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </label>
                <Input
                  value={projectTitle}
                  onChange={(e) => setProjectTitle(e.target.value)}
                  placeholder="e.g., The Midnight Heist, Sarah's Journey, City Lights"
                  className="bg-slate-800/60 border-purple-400/30 text-white placeholder:text-gray-500"
                />
                <p className="text-xs text-gray-400 mt-1">This helps organize and identify your cinematic project</p>
              </div>

              <div>
                <label className="text-purple-300 text-sm font-medium flex items-center gap-2 mb-3">
                  Describe Scene 2
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <HelpCircle className="w-3 h-3 text-purple-400" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <div className="text-xs space-y-1 max-w-64">
                          <p className="font-medium">Write in natural language:</p>
                          <p>• Describe actions and emotions</p>
                          <p>• Include character interactions</p>
                          <p>• Mention setting changes if any</p>
                          <p>• AI handles technical details</p>
                        </div>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </label>
                <div className="space-y-3">
                  <Textarea
                    value={nextSceneIdea}
                    onChange={(e) => setNextSceneIdea(e.target.value)}
                    placeholder="What happens next in your story? Write naturally as if describing a movie scene...

For example:
• Sarah realizes she's being followed and quickly ducks into a coffee shop, her heart racing as she peers through the window
• The detective examines the evidence under lamplight, noticing a detail that changes everything
• As the music swells, the two characters finally confess their feelings under the starlit sky"
                    className="bg-slate-800/60 border-purple-400/30 text-white placeholder:text-gray-500 min-h-[120px] resize-none"
                    rows={5}
                  />
                  
                  {/* Enhanced AI Assistance Notice */}
                  <div className="bg-purple-900/20 border border-purple-400/30 rounded-lg p-3">
                    <div className="flex items-start gap-2 text-xs">
                      <Sparkles className="w-4 h-4 text-purple-400 mt-0.5 flex-shrink-0" />
                      <div className="space-y-1 text-purple-200">
                        <p className="font-medium">AI will automatically enhance your scene with:</p>
                        <ul className="text-purple-300 space-y-0.5 ml-2">
                          <li>• Character consistency from Scene 1</li>
                          <li>• Visual style and mood matching</li>
                          <li>• Professional cinematography terms</li>
                          <li>• Technical specifications for your chosen platform</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  
                  {/* Smart inspiration suggestions */}
                  {suggestions.length > 0 && !nextSceneIdea && (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Lightbulb className="w-4 h-4 text-amber-400" />
                        <p className="text-xs text-amber-300 font-medium">Need inspiration? Choose one:</p>
                      </div>
                      <div className="grid gap-2">
                        {suggestions.slice(0, 3).map((suggestion, index) => (
                          <Button
                            key={index}
                            variant="outline"
                            size="sm"
                            onClick={() => handleSuggestionClick(suggestion)}
                            className="text-xs text-left justify-start border-amber-400/30 text-amber-200 hover:bg-amber-900/30 hover:text-white bg-slate-800/40 h-auto p-3"
                          >
                            <ArrowRight className="w-3 h-3 mr-2 flex-shrink-0" />
                            <span className="text-left leading-relaxed">{suggestion}</span>
                          </Button>
                        ))}
                      </div>
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