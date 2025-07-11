import React from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
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
  const dialogTypes = [{
    value: 'conversation',
    label: 'Conversation'
  }, {
    value: 'monologue',
    label: 'Monologue'
  }, {
    value: 'narration',
    label: 'Narration'
  }, {
    value: 'voiceover',
    label: 'Voiceover'
  }];
  const dialogStyles = [{
    value: 'natural',
    label: 'Natural'
  }, {
    value: 'dramatic',
    label: 'Dramatic'
  }, {
    value: 'casual',
    label: 'Casual'
  }, {
    value: 'formal',
    label: 'Formal'
  }, {
    value: 'whispered',
    label: 'Whispered'
  }, {
    value: 'energetic',
    label: 'Energetic'
  }];
  const languages = [{
    value: 'english',
    label: 'English'
  }, {
    value: 'spanish',
    label: 'Spanish'
  }, {
    value: 'french',
    label: 'French'
  }, {
    value: 'german',
    label: 'German'
  }, {
    value: 'italian',
    label: 'Italian'
  }, {
    value: 'japanese',
    label: 'Japanese'
  }, {
    value: 'korean',
    label: 'Korean'
  }, {
    value: 'mandarin',
    label: 'Mandarin'
  }];
  const handleToggleDialog = (enabled: boolean) => {
    setDialogSettings({
      ...dialogSettings,
      hasDialog: enabled,
      dialogType: enabled && !dialogSettings.dialogType ? 'conversation' : dialogSettings.dialogType,
      dialogStyle: enabled && !dialogSettings.dialogStyle ? 'natural' : dialogSettings.dialogStyle,
      language: enabled && !dialogSettings.language ? 'english' : dialogSettings.language
    });
  };
  return <motion.div initial={{
    opacity: 0,
    y: 20
  }} animate={{
    opacity: 1,
    y: 0
  }} exit={{
    opacity: 0,
    y: -20
  }} transition={{
    duration: 0.5
  }}>
      <Card className="bg-slate-800 border-slate-600 p-4 sm:p-6">
        {/* Header - Mobile optimized */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
          <div className="flex items-center gap-2 sm:gap-3">
            <MessageSquare className="w-5 h-5 sm:w-6 sm:h-6 text-purple-400 flex-shrink-0" />
            <h3 className="text-lg sm:text-xl font-semibold text-white">Dialog Options</h3>
          </div>
          <span className="text-xs sm:text-sm text-purple-300 bg-purple-900/30 px-2 py-1 rounded-full self-start sm:self-center">
            Optional - All Tiers
          </span>
        </div>

        <div className="space-y-4 sm:space-y-6">
          {/* Toggle Switch - Mobile optimized */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 p-3 sm:p-0">
            <div className="flex-1">
              <Label htmlFor="dialog-toggle" className="text-white font-medium text-sm sm:text-base">
                Include Dialog
              </Label>
              <p className="text-xs sm:text-sm mt-1 text-white">
                Add spoken words or narration to your video
              </p>
            </div>
            <div className="flex justify-end sm:justify-center">
              <Switch id="dialog-toggle" checked={dialogSettings.hasDialog} onCheckedChange={handleToggleDialog} className="scale-110 sm:scale-100" />
            </div>
          </div>

          {dialogSettings.hasDialog && <motion.div initial={{
          opacity: 0,
          height: 0
        }} animate={{
          opacity: 1,
          height: 'auto'
        }} className="space-y-4 sm:space-y-4">
              {/* Dialog Content */}
              <div>
                <Label className="text-white font-medium mb-2 block text-sm sm:text-base">Dialog Content</Label>
                <Textarea placeholder="Enter the specific dialog, narration, or speech you want in your video..." value={dialogSettings.dialogContent || ''} onChange={e => setDialogSettings({
              ...dialogSettings,
              dialogContent: e.target.value
            })} className="bg-slate-800/60 border-purple-500/30 text-white min-h-[100px] sm:min-h-[100px] placeholder:text-gray-400 text-sm sm:text-base" />
                <p className="text-xs text-gray-400 mt-1">
                  Be specific about what should be said and by whom
                </p>
              </div>

              {/* Dialog Type */}
              <div>
                <Label className="text-white font-medium mb-2 block text-sm sm:text-base">Dialog Type</Label>
                <Select value={dialogSettings.dialogType} onValueChange={value => setDialogSettings({
              ...dialogSettings,
              dialogType: value
            })}>
                  <SelectTrigger className="bg-slate-800/60 border-purple-500/30 text-white h-10 sm:h-10 text-sm sm:text-base">
                    <SelectValue placeholder="Select dialog type" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-purple-500/30 z-50">
                    {dialogTypes.map(type => <SelectItem key={type.value} value={type.value} className="text-white hover:bg-slate-700 focus:bg-slate-700">
                        {type.label}
                      </SelectItem>)}
                  </SelectContent>
                </Select>
              </div>

              {/* Dialog Style */}
              <div>
                <Label className="text-white font-medium mb-2 block text-sm sm:text-base">Dialog Style</Label>
                <Select value={dialogSettings.dialogStyle} onValueChange={value => setDialogSettings({
              ...dialogSettings,
              dialogStyle: value
            })}>
                  <SelectTrigger className="bg-slate-800/60 border-purple-500/30 text-white h-10 sm:h-10 text-sm sm:text-base">
                    <SelectValue placeholder="Select dialog style" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-purple-500/30 z-50">
                    {dialogStyles.map(style => <SelectItem key={style.value} value={style.value} className="text-white hover:bg-slate-700 focus:bg-slate-700">
                        {style.label}
                      </SelectItem>)}
                  </SelectContent>
                </Select>
              </div>

              {/* Language */}
              <div>
                <Label className="text-white font-medium mb-2 block text-sm sm:text-base">Language</Label>
                <Select value={dialogSettings.language} onValueChange={value => setDialogSettings({
              ...dialogSettings,
              language: value
            })}>
                  <SelectTrigger className="bg-slate-800/60 border-purple-500/30 text-white h-10 sm:h-10 text-sm sm:text-base">
                    <SelectValue placeholder="Select language" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-purple-500/30 z-50">
                    {languages.map(lang => <SelectItem key={lang.value} value={lang.value} className="text-white hover:bg-slate-700 focus:bg-slate-700">
                        {lang.label}
                      </SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </motion.div>}
        </div>

        {/* Navigation Buttons - Mobile optimized */}
        <div className="flex flex-col sm:flex-row justify-between gap-3 sm:gap-0 mt-6 sm:mt-8">
          <Button variant="outline" onClick={onPrevious} className="border-purple-500/30 text-purple-300 hover:bg-purple-900/20 w-full sm:w-auto h-11 sm:h-10 text-sm sm:text-sm order-2 sm:order-1">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Previous
          </Button>
          <Button onClick={onNext} className="bg-purple-600 hover:bg-purple-700 text-white w-full sm:w-auto h-11 sm:h-10 text-sm sm:text-sm order-1 sm:order-2">
            Continue
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </Card>
    </motion.div>;
};
export default DialogStep;