
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { fadeInVariants, viewportOptions } from '@/utils/animations';
import { Camera, Film, Sparkles, History, LogOut } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import AuthDialog from './AuthDialog';

// Import refactored components
import { PromptHistory, GeneratedPrompt } from './cinematic/types';
import { platforms } from './cinematic/constants';
import StepIndicator from './cinematic/StepIndicator';
import SceneStep from './cinematic/SceneStep';
import PlatformStep from './cinematic/PlatformStep';
import StyleStep from './cinematic/StyleStep';
import GeneratedPromptDisplay from './cinematic/GeneratedPromptDisplay';
import PromptHistoryComponent from './cinematic/PromptHistory';
import BackgroundAnimation from './cinematic/BackgroundAnimation';

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

  const handleGenerateNew = () => {
    setGeneratedPrompt(null);
    setCurrentStep(1);
    setSceneIdea('');
    setSelectedPlatform('');
    setSelectedEmotion('');
    setStyleReference('');
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
          <SceneStep
            sceneIdea={sceneIdea}
            setSceneIdea={setSceneIdea}
            onNext={handleNext}
          />
        );
      case 2:
        return (
          <PlatformStep
            selectedPlatform={selectedPlatform}
            setSelectedPlatform={setSelectedPlatform}
            selectedEmotion={selectedEmotion}
            setSelectedEmotion={setSelectedEmotion}
            onNext={handleNext}
            onPrevious={handlePrevious}
          />
        );
      case 3:
        return (
          <StyleStep
            styleReference={styleReference}
            setStyleReference={setStyleReference}
            onPrevious={handlePrevious}
            onGenerate={handleGenerate}
            isLoading={isLoading}
          />
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
        <BackgroundAnimation />

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

          <StepIndicator currentStep={currentStep} totalSteps={totalSteps} />

          <motion.div
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <Card className="bg-gradient-to-br from-slate-900/80 via-slate-900/60 to-purple-900/20 border border-purple-500/20 shadow-2xl shadow-purple-500/10 p-8 backdrop-blur-sm">
              {!generatedPrompt ? (
                renderStepContent()
              ) : (
                <GeneratedPromptDisplay
                  generatedPrompt={generatedPrompt}
                  onCopyToClipboard={copyToClipboard}
                  onDownloadPrompt={downloadPrompt}
                  onGenerateNew={handleGenerateNew}
                />
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

          <PromptHistoryComponent promptHistory={promptHistory} showHistory={showHistory} />
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
