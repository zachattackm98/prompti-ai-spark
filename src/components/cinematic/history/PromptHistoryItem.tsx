
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Trash2, Download, Copy, Eye, EyeOff, Film, Link } from 'lucide-react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { PromptHistoryItem as PromptHistoryItemType } from '@/hooks/usePromptHistory';

interface PromptHistoryItemProps {
  item: PromptHistoryItemType;
  isExpanded: boolean;
  onToggleExpanded: (id: string) => void;
  onCopyToClipboard: (text: string) => void;
  onDownloadPrompt: (item: PromptHistoryItemType) => void;
  onDeleteItem: (id: string) => void;
  onCreateScenes?: (item: PromptHistoryItemType) => void;
}

const PromptHistoryItem: React.FC<PromptHistoryItemProps> = ({
  item,
  isExpanded,
  onToggleExpanded,
  onCopyToClipboard,
  onDownloadPrompt,
  onDeleteItem,
  onCreateScenes
}) => {
  let promptData;
  try {
    promptData = JSON.parse(item.generated_prompt);
  } catch {
    promptData = null;
  }

  const getPlatformColor = (platform: string) => {
    const colors = {
      veo3: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
      sora: 'bg-green-500/20 text-green-300 border-green-500/30',
      runway: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
      pika: 'bg-orange-500/20 text-orange-300 border-orange-500/30'
    };
    return colors[platform as keyof typeof colors] || 'bg-gray-500/20 text-gray-300 border-gray-500/30';
  };

  const getEmotionColor = (emotion: string) => {
    const colors = {
      Dramatic: 'bg-red-500/20 text-red-300',
      Mysterious: 'bg-indigo-500/20 text-indigo-300',
      Uplifting: 'bg-yellow-500/20 text-yellow-300',
      Melancholic: 'bg-blue-500/20 text-blue-300',
      Intense: 'bg-orange-500/20 text-orange-300',
      Serene: 'bg-green-500/20 text-green-300',
      Suspenseful: 'bg-purple-500/20 text-purple-300',
      Romantic: 'bg-pink-500/20 text-pink-300',
      Epic: 'bg-amber-500/20 text-amber-300',
      Intimate: 'bg-rose-500/20 text-rose-300'
    };
    return colors[emotion as keyof typeof colors] || 'bg-gray-500/20 text-gray-300';
  };

  return (
    <div className="bg-slate-800/60 rounded-lg p-4 border border-slate-700 hover:border-slate-600 transition-colors">
      <div className="flex justify-between items-start mb-3">
        <h4 className="font-semibold text-white text-sm leading-tight">
          {item.scene_idea.length > 60 
            ? `${item.scene_idea.substring(0, 60)}...` 
            : item.scene_idea}
        </h4>
        <span className="text-xs text-gray-400 ml-2 flex-shrink-0">
          {new Date(item.created_at).toLocaleDateString()}
        </span>
      </div>
      
      <div className="flex flex-wrap gap-2 mb-3">
        <Badge className={getPlatformColor(item.platform)}>
          {item.platform.toUpperCase()}
        </Badge>
        <Badge className={getEmotionColor(item.emotion)}>
          {item.emotion}
        </Badge>
        {item.is_continuation && (
          <Badge className="bg-amber-500/20 text-amber-300 border-amber-500/30">
            <Link className="w-3 h-3 mr-1" />
            Continuation
          </Badge>
        )}
        {item.style && (
          <Badge variant="outline" className="text-gray-300 border-gray-500">
            {item.style.length > 20 ? `${item.style.substring(0, 20)}...` : item.style}
          </Badge>
        )}
      </div>

      {promptData && isExpanded && (
        <div className="mt-3 p-3 bg-slate-900/60 rounded border border-slate-600">
          <div className="space-y-3 text-sm">
            <div>
              <h5 className="font-medium text-purple-300 mb-1">Main Prompt:</h5>
              <p className="text-gray-300 leading-relaxed">{promptData.mainPrompt}</p>
            </div>
            <div>
              <h5 className="font-medium text-blue-300 mb-1">Technical Specs:</h5>
              <p className="text-gray-300 leading-relaxed">{promptData.technicalSpecs}</p>
            </div>
            <div>
              <h5 className="font-medium text-pink-300 mb-1">Style Notes:</h5>
              <p className="text-gray-300 leading-relaxed">{promptData.styleNotes}</p>
            </div>
            
            {/* Show detailed settings if available */}
            {(item.camera_settings || item.lighting_settings || item.dialog_settings || item.sound_settings) && (
              <div className="border-t border-slate-600 pt-3 mt-3">
                <h5 className="font-medium text-cyan-300 mb-2">Settings Used:</h5>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {item.camera_settings && (item.camera_settings.shot || item.camera_settings.angle || item.camera_settings.movement) && (
                    <div>
                      <span className="text-cyan-200 font-medium">Camera:</span>
                      <div className="text-gray-400">
                        {[item.camera_settings.shot, item.camera_settings.angle, item.camera_settings.movement].filter(Boolean).join(', ')}
                      </div>
                    </div>
                  )}
                  {item.lighting_settings && (item.lighting_settings.mood || item.lighting_settings.style || item.lighting_settings.timeOfDay) && (
                    <div>
                      <span className="text-yellow-200 font-medium">Lighting:</span>
                      <div className="text-gray-400">
                        {[item.lighting_settings.mood, item.lighting_settings.style, item.lighting_settings.timeOfDay].filter(Boolean).join(', ')}
                      </div>
                    </div>
                  )}
                  {item.dialog_settings && item.dialog_settings.hasDialog && (
                    <div>
                      <span className="text-green-200 font-medium">Dialog:</span>
                      <div className="text-gray-400">
                        {item.dialog_settings.dialogType} ({item.dialog_settings.language})
                      </div>
                    </div>
                  )}
                  {item.sound_settings && item.sound_settings.hasSound && (
                    <div>
                      <span className="text-orange-200 font-medium">Sound:</span>
                      <div className="text-gray-400">
                        {item.sound_settings.soundDescription || 'Custom sound enabled'}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      <div className="flex items-center justify-between mt-3">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onToggleExpanded(item.id)}
          className="text-gray-400 hover:text-white"
        >
          {isExpanded ? (
            <>
              <EyeOff className="w-4 h-4 mr-1" />
              Hide Details
            </>
          ) : (
            <>
              <Eye className="w-4 h-4 mr-1" />
              View Details
            </>
          )}
        </Button>
        
        <div className="flex gap-1">
          {onCreateScenes && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onCreateScenes(item)}
              className="text-purple-400 hover:text-purple-300"
              title="Create 2 scenes from this prompt"
            >
              <Film className="w-4 h-4" />
            </Button>
          )}
          {promptData && (
            <>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onCopyToClipboard(`${promptData.mainPrompt}\n\n${promptData.technicalSpecs}\n\n${promptData.styleNotes}`)}
                className="text-gray-400 hover:text-white"
              >
                <Copy className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onDownloadPrompt(item)}
                className="text-gray-400 hover:text-white"
              >
                <Download className="w-4 h-4" />
              </Button>
            </>
          )}
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="text-red-400 hover:text-red-300"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Prompt</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete this prompt? This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={() => onDeleteItem(item.id)} className="bg-red-500 hover:bg-red-600">
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
    </div>
  );
};

export default PromptHistoryItem;
