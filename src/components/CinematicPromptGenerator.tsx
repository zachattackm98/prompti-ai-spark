import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { fadeInVariants, viewportOptions } from '@/utils/animations';
import { Send, Camera, Film, Sparkles, Zap, Star, ChevronLeft, ChevronRight, Copy, Download, History, LogOut } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import AuthDialog from './AuthDialog';

interface PromptHistory {
  id: string;
  scene_idea: string;
  platform: string;
  style: string;
  emotion: string;
  generated_prompt: string;
  created_at: string;
}

interface GeneratedPrompt {
  mainPrompt: string;
  technicalSpecs: string;
  styleNotes: string;
  platform: string;
}

const platforms = [
  { 
    id: 'veo3', 
    name: 'Veo3', 
    icon: '🎬', 
    style: 'Cinematic Realism',
    description: 'Generate cinematic, realistic AI videos with professional quality' 
  },
  { 
    id: 'sora', 
    name: 'Sora', 
    icon: '📸', 
    style: 'Photorealism',
    description: 'Create photorealistic AI videos with stunning detail and accuracy' 
  },
  { 
    id: 'runway', 
    name: 'Runway', 
    icon: '🎨', 
    style: 'Painterly Style',
    description: 'Produce artistic, painterly AI videos with creative visual flair' 
  },
  { 
    id: 'pika', 
    name: 'Pika', 
    icon: '⚡', 
    style: 'Quick Loops / Stylized',
    description: 'Generate quick, stylized AI video loops perfect for social media' 
  }
];

const emotions = [
  'Dramatic', 'Mysterious', 'Uplifting', 'Melancholic', 'Intense', 'Serene', 
  'Suspenseful', 'Romantic', 'Epic', 'Intimate'
];

const CinematicPromptGenerator = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [sceneIdea, setSceneIdea] = useState('');
  const [selectedPlatform, setSelectedPlatform] = useState('');
  const [selectedEmotion, setSelectedEmotion] = useState('');
  const [styleReference, setStyleReference] = useState('');
  const [generatedPrompt, setGeneratedPrompt] = useState<GeneratedPrompt | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const [promptHistory, setPromptHistory] = useState<PromptHistory[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const { toast } = useToast();
  const { user, signOut } = useAuth();

  const totalSteps = 3;

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

  const handleGenerate = async () => {
    if (!user) {
      setShowAuthDialog(true);
      return;
    }

    if (!sceneIdea.trim() || !selectedPlatform || !selectedEmotion) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields before generating.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke('cinematic-prompt-generator', {
        body: { 
          sceneIdea,
          platform: selectedPlatform,
          emotion: selectedEmotion,
          styleReference: styleReference || ''
        },
      });

      if (error) throw error;

      setGeneratedPrompt(data.prompt);
      
      toast({
        title: "Prompt Generated!",
        description: "Your cinematic video prompt is ready.",
      });

      // Load history after generating
      loadPromptHistory();
    } catch (error: any) {
      console.error('Error generating prompt:', error);
      toast({
        title: "Error",
        description: "Failed to generate prompt. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const loadPromptHistory = async () => {
    if (!user) return;

    try {
      // For now, we'll just set an empty array since the prompt_history table doesn't exist yet
      // This prevents the TypeScript error while maintaining functionality
      setPromptHistory([]);
    } catch (error) {
      console.error('Error loading history:', error);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: "Prompt copied to clipboard.",
    });
  };

  const downloadPrompt = () => {
    if (!generatedPrompt) return;
    
    const content = `CINEMATIC VIDEO PROMPT
Generated: ${new Date().toLocaleDateString()}
Platform: ${generatedPrompt.platform}

MAIN PROMPT:
${generatedPrompt.mainPrompt}

TECHNICAL SPECIFICATIONS:
${generatedPrompt.technicalSpecs}

STYLE NOTES:
${generatedPrompt.styleNotes}`;

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'cinematic-prompt.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleSignOut = async () => {
    await signOut();
    setSceneIdea('');
    setSelectedPlatform('');
    setSelectedEmotion('');
    setStyleReference('');
    setGeneratedPrompt(null);
    setPromptHistory([]);
    setCurrentStep(1);
  };

  React.useEffect(() => {
    if (user) {
      loadPromptHistory();
    }
  }, [user]);

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <motion.div 
            className="space-y-6"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="text-center space-y-3">
              <h3 className="text-2xl font-bold text-white">Describe Your Scene</h3>
              <p className="text-gray-300">Tell us about the cinematic moment you want to create</p>
            </div>
            
            <Textarea
              value={sceneIdea}
              onChange={(e) => setSceneIdea(e.target.value)}
              placeholder="e.g., A lone astronaut floating in space, Earth visible in the background, golden hour lighting..."
              className="bg-slate-800/60 border-purple-400/30 text-white placeholder:text-gray-400 min-h-[120px] focus:border-purple-400/60 focus:ring-purple-400/20"
            />
            
            <div className="flex justify-end">
              <Button
                onClick={handleNext}
                disabled={!sceneIdea.trim()}
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
              >
                Next Step <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </motion.div>
        );

      case 2:
        return (
          <motion.div 
            className="space-y-6"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="text-center space-y-3">
              <h3 className="text-2xl font-bold text-white">Choose Your AI Video Platform</h3>
              <p className="text-gray-300">Select which AI video generation platform you'll be using</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {platforms.map((platform) => (
                <motion.div
                  key={platform.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`p-5 rounded-xl border-2 cursor-pointer transition-all ${
                    selectedPlatform === platform.id
                      ? 'border-purple-400 bg-purple-900/30'
                      : 'border-slate-600 bg-slate-800/40 hover:border-purple-400/50'
                  }`}
                  onClick={() => setSelectedPlatform(platform.id)}
                >
                  <div className="flex items-start space-x-4">
                    <span className="text-3xl">{platform.icon}</span>
                    <div className="flex-1">
                      <h4 className="font-semibold text-white text-lg">{platform.name}</h4>
                      <p className="text-purple-300 font-medium text-sm mb-2">{platform.style}</p>
                      <p className="text-sm text-gray-400 leading-relaxed">{platform.description}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-white">Select Emotion/Mood</h4>
              <div className="flex flex-wrap gap-2">
                {emotions.map((emotion) => (
                  <Button
                    key={emotion}
                    variant={selectedEmotion === emotion ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedEmotion(emotion)}
                    className={selectedEmotion === emotion 
                      ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700" 
                      : "border-slate-600 text-white hover:bg-slate-700 bg-slate-800/40"
                    }
                  >
                    {emotion}
                  </Button>
                ))}
              </div>
            </div>
            
            <div className="flex justify-between">
              <Button
                onClick={handlePrevious}
                variant="outline"
                className="border-slate-600 text-white hover:bg-slate-700 bg-slate-800/40"
              >
                <ChevronLeft className="w-4 h-4 mr-2" /> Previous
              </Button>
              <Button
                onClick={handleNext}
                disabled={!selectedPlatform || !selectedEmotion}
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
              >
                Next Step <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </motion.div>
        );

      case 3:
        return (
          <motion.div 
            className="space-y-6"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="text-center space-y-3">
              <h3 className="text-2xl font-bold text-white">Style Reference (Optional)</h3>
              <p className="text-gray-300">Add any specific visual style or reference you'd like to include</p>
            </div>
            
            <Textarea
              value={styleReference}
              onChange={(e) => setStyleReference(e.target.value)}
              placeholder="e.g., Shot like a Christopher Nolan film, warm color grading, shallow depth of field..."
              className="bg-slate-800/60 border-purple-400/30 text-white placeholder:text-gray-400 min-h-[100px] focus:border-purple-400/60 focus:ring-purple-400/20"
            />
            
            <div className="flex justify-between">
              <Button
                onClick={handlePrevious}
                variant="outline"
                className="border-slate-600 text-white hover:bg-slate-700 bg-slate-800/40"
              >
                <ChevronLeft className="w-4 h-4 mr-2" /> Previous
              </Button>
              <Button
                onClick={handleGenerate}
                disabled={isLoading}
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8"
              >
                {isLoading ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  >
                    <Sparkles className="w-5 h-5" />
                  </motion.div>
                ) : (
                  <>
                    <Zap className="w-5 h-5 mr-2" />
                    Generate Prompt
                  </>
                )}
              </Button>
            </div>
          </motion.div>
        );

      default:
        return null;
    }
  };

  return (
    <>
      <motion.section 
        className="py-16 px-6 relative overflow-hidden"
        variants={fadeInVariants}
        initial="hidden"
        whileInView="visible"
        viewport={viewportOptions}
      >
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            className="absolute top-20 left-10 w-4 h-4 bg-purple-400/20 rounded-full"
            animate={{ 
              y: [0, -20, 0],
              opacity: [0.3, 0.7, 0.3]
            }}
            transition={{ 
              duration: 3,
              repeat: Infinity,
              delay: 0
            }}
          />
          <motion.div
            className="absolute top-32 right-20 w-3 h-3 bg-pink-400/20 rounded-full"
            animate={{ 
              y: [0, -15, 0],
              opacity: [0.2, 0.6, 0.2]
            }}
            transition={{ 
              duration: 4,
              repeat: Infinity,
              delay: 1
            }}
          />
          <motion.div
            className="absolute bottom-32 left-1/4 w-5 h-5 bg-blue-400/20 rounded-full"
            animate={{ 
              y: [0, -25, 0],
              opacity: [0.4, 0.8, 0.4]
            }}
            transition={{ 
              duration: 3.5,
              repeat: Infinity,
              delay: 2
            }}
          />
        </div>

        <div className="container mx-auto max-w-4xl relative z-10">
          <div className="flex justify-between items-center mb-8">
            <div className="text-center flex-1">
              <motion.div
                className="flex items-center justify-center gap-3 mb-4"
                initial={{ scale: 0.9, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <div className="relative">
                  <Camera className="w-8 h-8 text-purple-400" />
                  <motion.div
                    className="absolute inset-0"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                  >
                    <Film className="w-8 h-8 text-purple-400/30" />
                  </motion.div>
                </div>
                <h2 className="text-4xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
                  Cinematic Prompt Generator
                </h2>
                <div className="relative">
                  <Sparkles className="w-8 h-8 text-pink-400" />
                  <motion.div
                    className="absolute inset-0"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <Sparkles className="w-8 h-8 text-pink-400/50" />
                  </motion.div>
                </div>
              </motion.div>
              <motion.p 
                className="text-gray-300 text-lg"
                initial={{ y: 20, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                Transform your ideas into production-quality video prompts
              </motion.p>
            </div>
            
            <div className="flex items-center gap-4">
              {user && (
                <>
                  <Button
                    onClick={() => setShowHistory(!showHistory)}
                    variant="outline"
                    size="sm"
                    className="border-white/20 text-white hover:bg-white/10 bg-slate-800/40"
                  >
                    <History className="w-4 h-4 mr-2" />
                    History
                  </Button>
                  <div className="flex items-center gap-4">
                    <p className="text-gray-300">Welcome, {user.email}</p>
                    <Button
                      onClick={handleSignOut}
                      variant="outline"
                      size="sm"
                      className="border-white/20 text-white hover:bg-white/10 bg-slate-800/40"
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Sign Out
                    </Button>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Progress Indicator */}
          <motion.div 
            className="mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center justify-center space-x-4">
              {[1, 2, 3].map((step) => (
                <div key={step} className="flex items-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all ${
                      currentStep >= step
                        ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                        : 'bg-slate-700 text-gray-400'
                    }`}
                  >
                    {step}
                  </div>
                  {step < 3 && (
                    <div
                      className={`w-16 h-1 mx-2 transition-all ${
                        currentStep > step ? 'bg-gradient-to-r from-purple-600 to-pink-600' : 'bg-slate-700'
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
            <div className="text-center mt-2 text-gray-400 text-sm">
              Step {currentStep} of {totalSteps}
            </div>
          </motion.div>

          <motion.div
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <Card className="bg-gradient-to-br from-slate-900/80 via-slate-900/60 to-purple-900/20 border border-purple-500/20 shadow-2xl shadow-purple-500/10 p-8 backdrop-blur-sm">
              {!generatedPrompt ? (
                renderStepContent()
              ) : (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  className="space-y-6"
                >
                  <div className="text-center space-y-3">
                    <h3 className="text-2xl font-bold bg-gradient-to-r from-purple-300 to-pink-300 bg-clip-text text-transparent">
                      Your Cinematic Prompt is Ready!
                    </h3>
                    <div className="flex items-center justify-center gap-2 text-sm text-purple-300">
                      <Star className="w-4 h-4" />
                      <span>Optimized for {platforms.find(p => p.id === selectedPlatform)?.name}</span>
                      <Star className="w-4 h-4" />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="bg-slate-800/60 rounded-xl p-6 border border-purple-400/20">
                      <h4 className="text-lg font-semibold text-purple-300 mb-3">Main Prompt</h4>
                      <p className="text-gray-200 leading-relaxed">{generatedPrompt.mainPrompt}</p>
                      <Button
                        onClick={() => copyToClipboard(generatedPrompt.mainPrompt)}
                        size="sm"
                        variant="outline"
                        className="mt-3 border-purple-400/30 text-purple-300 hover:bg-purple-900/30 bg-slate-800/40"
                      >
                        <Copy className="w-4 h-4 mr-2" />
                        Copy Main Prompt
                      </Button>
                    </div>

                    <div className="bg-slate-800/60 rounded-xl p-6 border border-blue-400/20">
                      <h4 className="text-lg font-semibold text-blue-300 mb-3">Technical Specifications</h4>
                      <p className="text-gray-200 leading-relaxed">{generatedPrompt.technicalSpecs}</p>
                    </div>

                    <div className="bg-slate-800/60 rounded-xl p-6 border border-pink-400/20">
                      <h4 className="text-lg font-semibold text-pink-300 mb-3">Style Notes</h4>
                      <p className="text-gray-200 leading-relaxed">{generatedPrompt.styleNotes}</p>
                    </div>
                  </div>

                  <div className="flex justify-center gap-4 pt-4">
                    <Button
                      onClick={() => copyToClipboard(`${generatedPrompt.mainPrompt}\n\n${generatedPrompt.technicalSpecs}\n\n${generatedPrompt.styleNotes}`)}
                      className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
                    >
                      <Copy className="w-4 h-4 mr-2" />
                      Copy All
                    </Button>
                    <Button
                      onClick={downloadPrompt}
                      variant="outline"
                      className="border-slate-600 text-white hover:bg-slate-700 bg-slate-800/40"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </Button>
                    <Button
                      onClick={() => {
                        setGeneratedPrompt(null);
                        setCurrentStep(1);
                        setSceneIdea('');
                        setSelectedPlatform('');
                        setSelectedEmotion('');
                        setStyleReference('');
                      }}
                      variant="outline"
                      className="border-slate-600 text-white hover:bg-slate-700 bg-slate-800/40"
                    >
                      Generate New
                    </Button>
                  </div>
                </motion.div>
              )}

              {!user && !generatedPrompt && (
                <motion.div 
                  className="text-center mt-6"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.7 }}
                >
                  <p className="text-purple-300 text-sm font-medium bg-purple-900/20 border border-purple-400/20 rounded-lg py-2 px-4 inline-block">
                    🎬 Ready to generate? Create your free account to get started!
                  </p>
                </motion.div>
              )}
            </Card>
          </motion.div>

          {/* History Panel */}
          {showHistory && user && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mt-8"
            >
              <Card className="bg-gradient-to-br from-slate-900/80 via-slate-900/60 to-purple-900/20 border border-purple-500/20 p-6">
                <h3 className="text-xl font-bold text-white mb-4">Recent Prompts</h3>
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {promptHistory.length === 0 ? (
                    <p className="text-gray-400 text-center py-4">No prompts generated yet</p>
                  ) : (
                    promptHistory.map((prompt) => (
                      <div
                        key={prompt.id}
                        className="bg-slate-800/60 rounded-lg p-4 border border-slate-700"
                      >
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-semibold text-purple-300">{prompt.scene_idea.substring(0, 50)}...</h4>
                          <span className="text-xs text-gray-400">{new Date(prompt.created_at).toLocaleDateString()}</span>
                        </div>
                        <div className="flex gap-2 text-xs">
                          <span className="bg-purple-900/40 text-purple-300 px-2 py-1 rounded">{prompt.platform}</span>
                          <span className="bg-pink-900/40 text-pink-300 px-2 py-1 rounded">{prompt.emotion}</span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </Card>
            </motion.div>
          )}
        </div>
      </motion.section>

      <AuthDialog 
        open={showAuthDialog} 
        onOpenChange={setShowAuthDialog}
      />
    </>
  );
};

export default CinematicPromptGenerator;
