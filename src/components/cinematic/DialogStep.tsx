
import React from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MessageSquare, ArrowLeft, ArrowRight } from 'lucide-react';
import { DialogSettings } from './hooks/types';

interface DialogStepProps {
  dialogSettings: DialogSettings;
  setDialogSettings: (settings: DialogSettings) => void;
  onNext: () => void;
  onPrevious: () => void;
}

const DialogStep: React.FC<DialogStepProps> = ({
  dialogSettings,
  setDialogSettings,
  onNext,
  onPrevious
}) => {
  const dialogTypes = [
    { value: 'conversation', label: 'Conversation' },
    { value: 'monologue', label: 'Monologue' },
    { value: 'narration', label: 'Narration' },
    { value: 'voiceover', label: 'Voiceover' }
  ];

  const dialogStyles = [
    { value: 'natural', label: 'Natural' },
    { value: 'dramatic', label: 'Dramatic' },
    { value: 'casual', label: 'Casual' },
    { value: 'formal', label: 'Formal' },
    { value: 'whispered', label: 'Whispered' },
    { value: 'energetic', label: 'Energetic' }
  ];

  const languages = [
    { value: 'english', label: 'English' },
    { value: 'spanish', label: 'Spanish' },
    { value: 'french', label: 'French' },
    { value: 'german', label: 'German' },
    { value: 'italian', label: 'Italian' },
    { value: 'japanese', label: 'Japanese' },
    { value: 'korean', label: 'Korean' },
    { value: 'mandarin', label: 'Mandarin' }
  ];

  const handleToggleDialog = (enabled: boolean) => {
    setDialogSettings({
      ...dialogSettings,
      hasDialog: enabled,
      dialogType: enabled && !dialogSettings.dialogType ? 'conversation' : dialogSettings.dialogType,
      dialogStyle: enabled && !dialogSettings.dialogStyle ? 'natural' : dialogSettings.dialogStyle,
      language: enabled && !dialogSettings.language ? 'english' : dialogSettings.language
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="bg-gradient-to-br from-slate-800/50 to-purple-900/30 border-purple-500/30 p-6">
        <div className="flex items-center gap-3 mb-6">
          <MessageSquare className="w-6 h-6 text-purple-400" />
          <h3 className="text-xl font-semibold text-white">Dialog Options</h3>
          <span className="text-sm text-purple-300 bg-purple-900/30 px-2 py-1 rounded-full">
            Optional - All Tiers
          </span>
        </div>

        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="dialog-toggle" className="text-white font-medium">
                Include Dialog
              </Label>
              <p className="text-sm text-gray-400 mt-1">
                Add spoken words or narration to your video
              </p>
            </div>
            <Switch
              id="dialog-toggle"
              checked={dialogSettings.hasDialog}
              onCheckedChange={handleToggleDialog}
            />
          </div>

          {dialogSettings.hasDialog && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="space-y-4"
            >
              <div>
                <Label className="text-white font-medium mb-2 block">Dialog Type</Label>
                <Select
                  value={dialogSettings.dialogType}
                  onValueChange={(value) => setDialogSettings({ ...dialogSettings, dialogType: value })}
                >
                  <SelectTrigger className="bg-slate-800/60 border-purple-500/30 text-white">
                    <SelectValue placeholder="Select dialog type" />
                  </SelectTrigger>
                  <SelectContent>
                    {dialogTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-white font-medium mb-2 block">Dialog Style</Label>
                <Select
                  value={dialogSettings.dialogStyle}
                  onValueChange={(value) => setDialogSettings({ ...dialogSettings, dialogStyle: value })}
                >
                  <SelectTrigger className="bg-slate-800/60 border-purple-500/30 text-white">
                    <SelectValue placeholder="Select dialog style" />
                  </SelectTrigger>
                  <SelectContent>
                    {dialogStyles.map((style) => (
                      <SelectItem key={style.value} value={style.value}>
                        {style.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-white font-medium mb-2 block">Language</Label>
                <Select
                  value={dialogSettings.language}
                  onValueChange={(value) => setDialogSettings({ ...dialogSettings, language: value })}
                >
                  <SelectTrigger className="bg-slate-800/60 border-purple-500/30 text-white">
                    <SelectValue placeholder="Select language" />
                  </SelectTrigger>
                  <SelectContent>
                    {languages.map((lang) => (
                      <SelectItem key={lang.value} value={lang.value}>
                        {lang.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </motion.div>
          )}
        </div>

        <div className="flex justify-between mt-8">
          <Button
            variant="outline"
            onClick={onPrevious}
            className="border-purple-500/30 text-purple-300 hover:bg-purple-900/20"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Previous
          </Button>
          <Button
            onClick={onNext}
            className="bg-purple-600 hover:bg-purple-700 text-white"
          >
            Continue
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </Card>
    </motion.div>
  );
};

export default DialogStep;
