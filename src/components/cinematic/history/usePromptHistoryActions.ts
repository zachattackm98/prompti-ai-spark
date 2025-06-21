
import { useToast } from '@/hooks/use-toast';
import { PromptHistoryItem } from '@/hooks/usePromptHistory';

export const usePromptHistoryActions = () => {
  const { toast } = useToast();

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: "Prompt copied to clipboard.",
    });
  };

  const downloadPrompt = (item: PromptHistoryItem) => {
    try {
      const promptData = JSON.parse(item.generated_prompt);
      const content = `CINEMATIC VIDEO PROMPT
Generated: ${new Date(item.created_at).toLocaleDateString()}
Platform: ${item.platform.toUpperCase()}
Emotion: ${item.emotion}
Scene: ${item.scene_idea}

MAIN PROMPT:
${promptData.mainPrompt}

TECHNICAL SPECIFICATIONS:
${promptData.technicalSpecs}

STYLE NOTES:
${promptData.styleNotes}`;

      const blob = new Blob([content], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `prompt-${item.platform}-${new Date(item.created_at).toISOString().split('T')[0]}.txt`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to download prompt.",
        variant: "destructive"
      });
    }
  };

  return {
    copyToClipboard,
    downloadPrompt
  };
};
