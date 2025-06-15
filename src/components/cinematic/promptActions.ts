
import { useToast } from '@/hooks/use-toast';

export const usePromptActions = (subscription: any) => {
  const { toast } = useToast();

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: "Prompt copied to clipboard.",
    });
  };

  const downloadPrompt = (generatedPrompt: any) => {
    if (!generatedPrompt) return;
    
    const content = `CINEMATIC VIDEO PROMPT
Generated: ${new Date().toLocaleDateString()}
Platform: ${generatedPrompt.platform}
Subscription: ${subscription.tier.toUpperCase()}

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

  return {
    copyToClipboard,
    downloadPrompt
  };
};
