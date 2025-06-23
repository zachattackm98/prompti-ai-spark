
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Camera, Sparkles } from 'lucide-react';

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
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="relative w-full"
    >
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden rounded-2xl">
        <motion.div
          className="absolute -top-20 -right-20 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl"
          animate={{
            x: [0, 20, 0],
            y: [0, -20, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute -bottom-20 -left-20 w-80 h-80 bg-green-500/8 rounded-full blur-3xl"
          animate={{
            x: [0, -15, 0],
            y: [0, 15, 0],
            scale: [1, 1.05, 1],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2
          }}
        />
      </div>

      <Card className="relative bg-gradient-to-br from-emerald-900/20 via-green-900/30 to-slate-900/40 border border-emerald-500/30 backdrop-blur-sm overflow-hidden">
        {/* Gradient Border Effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 via-green-500/20 to-emerald-500/20 opacity-50 blur-xl" />
        
        <div className="relative p-6 space-y-6">
          {/* Header with consistent styling */}
          <motion.div 
            className="text-center space-y-3"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <div className="flex items-center justify-center gap-3">
              <motion.div
                className="p-2 rounded-full bg-emerald-500/20 border border-emerald-400/30"
                whileHover={{ scale: 1.05, rotate: 5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Camera className="w-6 h-6 text-emerald-400" />
              </motion.div>
              <h2 className="text-2xl font-bold bg-gradient-to-r from-emerald-400 via-green-300 to-emerald-400 bg-clip-text text-transparent">
                Animal Vlog Creator
              </h2>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
              >
                <Sparkles className="w-5 h-5 text-emerald-400" />
              </motion.div>
            </div>
            <p className="text-emerald-200/80 text-sm font-medium">
              Step 3: Add dialogue or narration (optional)
            </p>
          </motion.div>

          {/* Main Content */}
          <motion.div 
            className="space-y-5"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            {/* Toggle Section */}
            <div className="p-4 bg-gradient-to-r from-emerald-900/30 to-green-900/30 rounded-xl border border-emerald-500/20">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <label className="text-emerald-100 font-semibold text-base">
                    Include Dialogue/Narration
                  </label>
                  <p className="text-emerald-200/70 text-sm">
                    Add your voice to bring the scene to life
                  </p>
                </div>
                <Switch
                  checked={hasDialogue}
                  onCheckedChange={setHasDialogue}
                  className="data-[state=checked]:bg-emerald-600 data-[state=unchecked]:bg-slate-600"
                />
              </div>
            </div>

            {/* Dialogue Content */}
            {hasDialogue && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="space-y-4"
              >
                <div className="space-y-3">
                  <label className="block text-emerald-100 font-semibold text-base">
                    Your Dialogue Content
                  </label>
                  <Textarea
                    value={dialogueContent}
                    onChange={(e) => setDialogueContent(e.target.value)}
                    placeholder="What would you say as the narrator? (e.g., 'Look at this adorable little explorer!' or 'Today we're teaching Rex some new tricks')"
                    className="min-h-[100px] bg-slate-800/60 border-emerald-500/40 text-emerald-50 placeholder-emerald-300/60 focus:border-emerald-400/70 focus:ring-emerald-400/30 resize-none"
                  />
                  <p className="text-emerald-300/60 text-xs">
                    Be specific about what should be said and the tone you want
                  </p>
                </div>
              </motion.div>
            )}
          </motion.div>

          {/* Action Buttons */}
          <motion.div 
            className="flex gap-4 pt-4"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.5 }}
          >
            <Button
              onClick={onPrevious}
              variant="outline"
              className="flex-1 border-emerald-500/40 text-emerald-300 hover:bg-emerald-900/30 hover:border-emerald-400/60 transition-all duration-200"
            >
              Back to Scene
            </Button>
            <Button
              onClick={handleGenerate}
              disabled={isLoading || (hasDialogue && !dialogueContent.trim())}
              className="flex-1 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white font-semibold shadow-lg hover:shadow-emerald-500/25 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <motion.div 
                    className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  />
                  Generating Vlog...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Camera className="w-4 h-4" />
                  Generate Vlog Prompt
                </div>
              )}
            </Button>
          </motion.div>
        </div>
      </Card>
    </motion.div>
  );
};

export default DialogueStep;
