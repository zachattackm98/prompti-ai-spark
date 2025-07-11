import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { RotateCcw, Copy, Users, MapPin, Settings, Palette, Camera, Volume2, MessageSquare, Sun } from 'lucide-react';
import { motion } from 'framer-motion';

interface SceneCreationModeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onModeSelect: (mode: 'fresh' | 'continue') => void;
  projectTitle: string;
  nextSceneIdea: string;
}

const SceneCreationModeDialog: React.FC<SceneCreationModeDialogProps> = ({
  open,
  onOpenChange,
  onModeSelect,
  projectTitle,
  nextSceneIdea
}) => {
  const handleModeSelect = (mode: 'fresh' | 'continue') => {
    onModeSelect(mode);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl bg-gradient-to-br from-slate-900/95 to-purple-900/30 border border-purple-400/30">
        <DialogHeader className="text-center space-y-2 pb-4">
          <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            How would you like to create Scene 2?
          </DialogTitle>
          <DialogDescription className="text-slate-300 text-base">
            Choose how much information to carry over from your current scene
          </DialogDescription>
        </DialogHeader>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Fresh Mode */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="h-full bg-gradient-to-br from-slate-800/80 to-slate-700/40 border-2 border-slate-600/50 hover:border-slate-500/70 transition-all duration-300 cursor-pointer group"
                  onClick={() => handleModeSelect('fresh')}>
              <div className="p-6 space-y-4 h-full flex flex-col">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-slate-700/60 rounded-lg group-hover:bg-slate-600/60 transition-colors">
                    <RotateCcw className="w-6 h-6 text-slate-300" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-white">Fresh Mode</h3>
                    <Badge variant="outline" className="mt-1 text-xs border-slate-500/50 text-slate-400">
                      Clean Start
                    </Badge>
                  </div>
                </div>

                <p className="text-slate-300 leading-relaxed flex-grow">
                  Start Scene 2 with a clean slate. Only basic project information is carried over, 
                  giving you complete creative freedom for the new scene.
                </p>

                <div className="space-y-3">
                  <h4 className="text-sm font-medium text-slate-200 flex items-center gap-2">
                    <Copy className="w-4 h-4 text-green-400" />
                    What's Carried Over
                  </h4>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-slate-300">
                      <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                      <span>Project title and organization</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-300">
                      <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                      <span>Scene numbering</span>
                    </div>
                  </div>

                  <h4 className="text-sm font-medium text-slate-200 flex items-center gap-2 pt-2">
                    <RotateCcw className="w-4 h-4 text-orange-400" />
                    What Resets
                  </h4>
                  <div className="grid grid-cols-2 gap-1 text-xs text-slate-400">
                    <div className="flex items-center gap-1">
                      <div className="w-1.5 h-1.5 bg-orange-400 rounded-full"></div>
                      <span>Characters</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-1.5 h-1.5 bg-orange-400 rounded-full"></div>
                      <span>Locations</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-1.5 h-1.5 bg-orange-400 rounded-full"></div>
                      <span>Platform</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-1.5 h-1.5 bg-orange-400 rounded-full"></div>
                      <span>Emotion</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-1.5 h-1.5 bg-orange-400 rounded-full"></div>
                      <span>Camera settings</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-1.5 h-1.5 bg-orange-400 rounded-full"></div>
                      <span>Lighting</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-1.5 h-1.5 bg-orange-400 rounded-full"></div>
                      <span>Sound settings</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-1.5 h-1.5 bg-orange-400 rounded-full"></div>
                      <span>Dialog settings</span>
                    </div>
                  </div>
                </div>

                <Button className="w-full bg-slate-700 hover:bg-slate-600 text-white border border-slate-600 group-hover:border-slate-500">
                  Choose Fresh Mode
                </Button>
              </div>
            </Card>
          </motion.div>

          {/* Continue Mode */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="h-full bg-gradient-to-br from-purple-900/40 to-pink-900/20 border-2 border-purple-400/50 hover:border-purple-400/70 transition-all duration-300 cursor-pointer group"
                  onClick={() => handleModeSelect('continue')}>
              <div className="p-6 space-y-4 h-full flex flex-col">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-700/60 rounded-lg group-hover:bg-purple-600/60 transition-colors">
                    <Copy className="w-6 h-6 text-purple-300" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-white">Continue Mode</h3>
                    <Badge variant="outline" className="mt-1 text-xs border-purple-400/50 text-purple-300">
                      Story Continuity
                    </Badge>
                  </div>
                </div>

                <p className="text-slate-300 leading-relaxed flex-grow">
                  Maintain story continuity by carrying over key creative elements. Perfect for sequential 
                  scenes that follow the same characters and narrative.
                </p>

                <div className="space-y-3">
                  <h4 className="text-sm font-medium text-slate-200 flex items-center gap-2">
                    <Copy className="w-4 h-4 text-purple-400" />
                    What's Carried Over
                  </h4>
                  <div className="grid grid-cols-2 gap-1 text-xs text-purple-200">
                    <div className="flex items-center gap-1">
                      <Users className="w-3 h-3 text-blue-400" />
                      <span>Characters</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-green-400" />
                      <span>Setting</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Palette className="w-3 h-3 text-pink-400" />
                      <span>Style reference</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Settings className="w-3 h-3 text-purple-400" />
                      <span>Platform</span>
                    </div>
                  </div>

                  <h4 className="text-sm font-medium text-slate-200 flex items-center gap-2 pt-2">
                    <RotateCcw className="w-4 h-4 text-orange-400" />
                    What Resets
                  </h4>
                  <div className="grid grid-cols-2 gap-1 text-xs text-slate-400">
                    <div className="flex items-center gap-1">
                      <Camera className="w-3 h-3 text-orange-400" />
                      <span>Camera settings</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Sun className="w-3 h-3 text-orange-400" />
                      <span>Lighting</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Volume2 className="w-3 h-3 text-orange-400" />
                      <span>Sound settings</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MessageSquare className="w-3 h-3 text-orange-400" />
                      <span>Dialog settings</span>
                    </div>
                  </div>
                </div>

                <Button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white">
                  Choose Continue Mode
                </Button>
              </div>
            </Card>
          </motion.div>
        </div>

        <div className="pt-4 border-t border-slate-700/50">
          <div className="text-center space-y-2">
            <p className="text-sm text-slate-400">
              Creating Scene 2 for: <span className="text-purple-300 font-medium">"{projectTitle}"</span>
            </p>
            <p className="text-xs text-slate-500">
              Scene idea: {nextSceneIdea}
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SceneCreationModeDialog;