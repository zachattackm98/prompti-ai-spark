
import React from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Camera, ChevronLeft, Video } from 'lucide-react';
import { motion } from 'framer-motion';
import { useIsMobile } from '@/hooks/use-mobile';
import MobileOptimizedCard from './MobileOptimizedCard';
import ResponsiveContainer from './ResponsiveContainer';

interface DialogueStepProps {
  hasDialogue: boolean;
  setHasDialogue: (value: boolean) => void;
  dialogueContent: string;
  setDialogueContent: (value: string) => void;
  onPrevious: () => void;
  handleGenerate: () => void;
  isLoading: boolean;
}

const DialogueStep: React.FC<DialogueStepProps> = ({
  hasDialogue,
  setHasDialogue,
  dialogueContent,
  setDialogueContent,
  onPrevious,
  handleGenerate,
  isLoading
}) => {
  const isMobile = useIsMobile();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="w-full max-w-none"
    >
      <MobileOptimizedCard
        gradientFrom="from-slate-900/90"
        gradientTo="to-green-900/20"
        borderColor="border-green-500/30"
      >
        {/* Background Animation */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            className="absolute -top-10 -right-10 w-32 h-32 bg-green-500/10 rounded-full blur-xl"
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.6, 0.3]
            }}
            transition={{ duration: 4, repeat: Infinity }}
          />
        </div>

        <ResponsiveContainer spacing="normal">
          {/* Header */}
          <motion.div 
            className="text-center space-y-3"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <div className="flex items-center justify-center gap-3 text-green-300">
              <Camera className={isMobile ? "w-5 h-5" : "w-6 h-6"} />
              <h2 className={`font-bold bg-gradient-to-r from-green-300 via-emerald-300 to-teal-300 bg-clip-text text-transparent ${
                isMobile ? 'text-xl' : 'text-2xl'
              }`}>
                Animal Vlog Mode
              </h2>
            </div>
            <p className={`text-slate-300 font-medium ${isMobile ? 'text-sm' : 'text-base'}`}>
              Step 3: Add dialogue (optional)
            </p>
            <p className={`text-slate-400 max-w-md mx-auto ${isMobile ? 'text-xs' : 'text-sm'}`}>
              Add narration or dialogue to make your vlog more engaging
            </p>
          </motion.div>

          {/* Content */}
          <motion.div
            className="space-y-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            {/* Toggle Section */}
            <div className={`
              flex items-center justify-between p-4 rounded-lg bg-slate-800/30 border border-slate-600
              ${isMobile ? 'flex-col gap-3' : 'flex-row'}
            `}>
              <div className={`${isMobile ? 'text-center' : 'text-left'}`}>
                <label className={`font-medium text-white block ${isMobile ? 'text-sm' : 'text-base'}`}>
                  Add Dialogue/Narration
                </label>
                <p className={`text-slate-400 ${isMobile ? 'text-xs mt-1' : 'text-sm'}`}>
                  Include voice-over or commentary
                </p>
              </div>
              <Switch
                checked={hasDialogue}
                onCheckedChange={setHasDialogue}
                className="data-[state=checked]:bg-green-600"
              />
            </div>

            {/* Dialogue Input */}
            {hasDialogue && (
              <motion.div
                className="space-y-3"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
              >
                <label className={`block font-medium text-white ${isMobile ? 'text-sm' : 'text-base'}`}>
                  Dialogue Content
                </label>
                <Textarea
                  value={dialogueContent}
                  onChange={(e) => setDialogueContent(e.target.value)}
                  placeholder="What would you say as the narrator? (e.g., 'Look at this adorable little explorer!' or 'Today we're teaching Rex some new tricks')"
                  className={`
                    ${isMobile ? 'min-h-[100px] text-sm' : 'min-h-[120px] text-base'}
                    bg-slate-800/50 border-slate-600 text-white placeholder-slate-400
                    focus:border-green-400/60 focus:ring-2 focus:ring-green-400/20
                    transition-all duration-300
                  `}
                />
                <p className={`text-slate-500 ${isMobile ? 'text-xs' : 'text-sm'}`}>
                  Tip: Keep it conversational and engaging for your audience
                </p>
              </motion.div>
            )}
          </motion.div>

          {/* Navigation Buttons */}
          <motion.div
            className={`flex gap-3 ${isMobile ? 'flex-col' : 'flex-row'}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
          >
            <Button
              onClick={onPrevious}
              variant="outline"
              className={`
                border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-white
                ${isMobile ? 'h-12' : 'flex-1 h-14'}
              `}
            >
              <div className="flex items-center gap-2">
                <ChevronLeft className="w-4 h-4" />
                Back
              </div>
            </Button>
            <Button
              onClick={handleGenerate}
              disabled={isLoading || (hasDialogue && !dialogueContent.trim())}
              className={`
                transition-all duration-300
                ${!isLoading && (!hasDialogue || dialogueContent.trim())
                  ? 'bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 hover:from-green-700 hover:via-emerald-700 hover:to-teal-700 shadow-lg shadow-green-500/20'
                  : 'bg-slate-700 text-slate-400 cursor-not-allowed'
                }
                ${isMobile ? 'h-12' : 'flex-1 h-14'}
              `}
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                  Generating...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Video className="w-4 h-4" />
                  Generate Vlog Prompt
                </div>
              )}
            </Button>
          </div>
        </ResponsiveContainer>
      </MobileOptimizedCard>
    </motion.div>
  );
};

export default DialogueStep;
