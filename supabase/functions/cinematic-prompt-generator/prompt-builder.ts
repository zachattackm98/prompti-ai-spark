
import type { PromptRequest, PlatformConfig } from './types.ts';
import { PLATFORM_PROMPTS } from './constants.ts';

export function buildSystemPrompt(request: PromptRequest): string {
  const { platform, emotion, tier, cameraSettings, lightingSettings, dialogSettings, soundSettings, enhancedPrompts, styleReference } = request;
  
  const selectedPlatform = PLATFORM_PROMPTS[platform as keyof typeof PLATFORM_PROMPTS] || PLATFORM_PROMPTS.veo3;

  let systemPrompt = `${selectedPlatform.system}

Your task is to transform user scene ideas into three distinct components:

1. MAIN PROMPT: A detailed, cinematic description optimized for AI video generation
2. TECHNICAL SPECS: Platform-specific technical parameters and settings
3. STYLE NOTES: Visual style, mood, and artistic direction

Guidelines:
- Use specific cinematography terms (wide shot, close-up, dolly zoom, etc.)
- Include detailed lighting descriptions (golden hour, dramatic shadows, etc.)
- Specify camera movements and angles
- Mention color palettes and mood
- Keep prompts under 200 words each section
- Make it production-ready and professional

Current scene emotion/mood: ${emotion}
User subscription tier: ${tier?.toUpperCase()}`;

  // Add dialog specifications
  if (dialogSettings?.hasDialog) {
    systemPrompt += `\n\nDIALOG SPECIFICATIONS:
- Include Dialog: Yes
- Dialog Type: ${dialogSettings.dialogType || 'Not specified'}
- Dialog Style: ${dialogSettings.dialogStyle || 'Not specified'}
- Language: ${dialogSettings.language || 'Not specified'}
Please incorporate these dialog requirements into your prompts, ensuring the scene includes appropriate spoken elements.`;
  }

  // Add sound specifications
  if (soundSettings?.hasSound) {
    systemPrompt += `\n\nSOUND DESIGN SPECIFICATIONS:
- Include Sound Design: Yes
- Music Genre: ${soundSettings.musicGenre || 'Not specified'}
- Sound Effects: ${soundSettings.soundEffects || 'Not specified'}
- Ambience: ${soundSettings.ambience || 'Not specified'}
Please incorporate these audio elements into your technical specifications and style notes.`;
  }

  // Add enhanced features for higher tiers
  if (cameraSettings && (cameraSettings.angle || cameraSettings.movement || cameraSettings.shot)) {
    systemPrompt += `\n\nCAMERA SPECIFICATIONS:
- Camera Angle: ${cameraSettings.angle || 'Not specified'}
- Camera Movement: ${cameraSettings.movement || 'Not specified'}  
- Shot Type: ${cameraSettings.shot || 'Not specified'}
Please incorporate these camera specifications into your technical recommendations.`;
  }

  if (lightingSettings && (lightingSettings.mood || lightingSettings.style || lightingSettings.timeOfDay)) {
    systemPrompt += `\n\nLIGHTING SPECIFICATIONS:
- Lighting Mood: ${lightingSettings.mood || 'Not specified'}
- Lighting Style: ${lightingSettings.style || 'Not specified'}
- Time of Day: ${lightingSettings.timeOfDay || 'Not specified'}
Please incorporate these lighting specifications into your style and technical recommendations.`;
  }

  if (enhancedPrompts) {
    systemPrompt += `\n\nENHANCED PROMPTS: This user has premium access. Provide more detailed, technical, and professional-grade prompts with advanced cinematography techniques, specific color science references, and industry-standard terminology.`;
  }

  if (styleReference) {
    systemPrompt += `\n\nStyle reference: ${styleReference}`;
  }

  return systemPrompt;
}

export function parsePromptResponse(generatedContent: string, platform: string) {
  const selectedPlatform = PLATFORM_PROMPTS[platform as keyof typeof PLATFORM_PROMPTS] || PLATFORM_PROMPTS.veo3;
  
  // Parse the response into structured sections
  const sections = generatedContent.split(/(?:MAIN PROMPT:|TECHNICAL SPECS:|STYLE NOTES:)/i);
  
  return {
    mainPrompt: sections[1]?.trim() || generatedContent,
    technicalSpecs: sections[2]?.trim() || selectedPlatform.technical,
    styleNotes: sections[3]?.trim() || `Professional cinematic quality`,
    platform: platform
  };
}
