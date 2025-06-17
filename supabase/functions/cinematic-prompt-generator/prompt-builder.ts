
import type { PromptRequest, PlatformConfig } from './types.ts';
import { PLATFORM_PROMPTS } from './constants.ts';

export function buildSystemPrompt(request: PromptRequest): string {
  const { 
    platform, 
    emotion, 
    tier, 
    cameraSettings, 
    lightingSettings, 
    dialogSettings, 
    soundSettings, 
    enhancedPrompts, 
    styleReference,
    sceneContext,
    sceneNumber = 1,
    totalScenes = 1,
    isMultiScene = false
  } = request;
  
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

  // Add multi-scene context if applicable
  if (isMultiScene && sceneContext) {
    systemPrompt += `\n\nMULTI-SCENE PROJECT CONTEXT:
This is Scene ${sceneNumber} of ${totalScenes} in a cinematic sequence.

IMPORTANT CONTINUITY REQUIREMENTS:
- Maintain consistent character appearances, clothing, and mannerisms
- Preserve environmental details and lighting consistency where appropriate
- Ensure emotional and narrative progression flows naturally from previous scenes
- Keep the same visual style and color palette established in earlier scenes
- Use transitional elements that connect this scene to the story arc

PREVIOUS SCENE CONTEXT:
${sceneContext}

When generating this scene, ensure it feels like a natural continuation of the story while advancing the narrative.`;
  }

  // Add dialog specifications
  if (dialogSettings?.hasDialog) {
    systemPrompt += `\n\nDIALOG SPECIFICATIONS:
- Include Dialog: Yes`;
    
    if (dialogSettings.dialogContent) {
      systemPrompt += `\n- Dialog Content: "${dialogSettings.dialogContent}"`;
    }
    
    if (dialogSettings.dialogType) {
      systemPrompt += `\n- Dialog Type: ${dialogSettings.dialogType}`;
    }
    
    if (dialogSettings.dialogStyle) {
      systemPrompt += `\n- Dialog Style: ${dialogSettings.dialogStyle}`;
    }
    
    if (dialogSettings.language) {
      systemPrompt += `\n- Language: ${dialogSettings.language}`;
    }
    
    systemPrompt += `\nPlease incorporate these dialog requirements into your prompts, ensuring the scene includes the specified spoken elements.`;
  }

  // Add sound specifications
  if (soundSettings?.hasSound) {
    systemPrompt += `\n\nSOUND DESIGN SPECIFICATIONS:
- Include Sound Design: Yes`;
    
    if (soundSettings.soundDescription) {
      systemPrompt += `\n- Sound Description: "${soundSettings.soundDescription}"`;
    }
    
    if (soundSettings.musicGenre) {
      systemPrompt += `\n- Music Genre: ${soundSettings.musicGenre}`;
    }
    
    if (soundSettings.soundEffects) {
      systemPrompt += `\n- Sound Effects: ${soundSettings.soundEffects}`;
    }
    
    if (soundSettings.ambience) {
      systemPrompt += `\n- Ambience: ${soundSettings.ambience}`;
    }
    
    systemPrompt += `\nPlease incorporate these audio elements into your technical specifications and style notes.`;
  }

  // Add enhanced features for higher tiers
  if (cameraSettings && (cameraSettings.angle || cameraSettings.movement || cameraSettings.shot)) {
    systemPrompt += `\n\nCAMERA SPECIFICATIONS:`;
    if (cameraSettings.angle) systemPrompt += `\n- Camera Angle: ${cameraSettings.angle}`;
    if (cameraSettings.movement) systemPrompt += `\n- Camera Movement: ${cameraSettings.movement}`;
    if (cameraSettings.shot) systemPrompt += `\n- Shot Type: ${cameraSettings.shot}`;
    systemPrompt += `\nPlease incorporate these camera specifications into your technical recommendations.`;
  }

  if (lightingSettings && (lightingSettings.mood || lightingSettings.style || lightingSettings.timeOfDay)) {
    systemPrompt += `\n\nLIGHTING SPECIFICATIONS:`;
    if (lightingSettings.mood) systemPrompt += `\n- Lighting Mood: ${lightingSettings.mood}`;
    if (lightingSettings.style) systemPrompt += `\n- Lighting Style: ${lightingSettings.style}`;
    if (lightingSettings.timeOfDay) systemPrompt += `\n- Time of Day: ${lightingSettings.timeOfDay}`;
    systemPrompt += `\nPlease incorporate these lighting specifications into your style and technical recommendations.`;
  }

  if (enhancedPrompts) {
    systemPrompt += `\n\nENHANCED PROMPTS: This user has premium access. Provide more detailed, technical, and professional-grade prompts with advanced cinematography techniques, specific color science references, and industry-standard terminology.`;
  }

  if (styleReference) {
    systemPrompt += `\n\nStyle reference: ${styleReference}`;
  }

  return systemPrompt;
}

export function parsePromptResponse(generatedContent: string, platform: string, sceneNumber?: number, totalScenes?: number) {
  const selectedPlatform = PLATFORM_PROMPTS[platform as keyof typeof PLATFORM_PROMPTS] || PLATFORM_PROMPTS.veo3;
  
  // Parse the response into structured sections
  const sections = generatedContent.split(/(?:MAIN PROMPT:|TECHNICAL SPECS:|STYLE NOTES:)/i);
  
  return {
    mainPrompt: sections[1]?.trim() || generatedContent,
    technicalSpecs: sections[2]?.trim() || selectedPlatform.technical,
    styleNotes: sections[3]?.trim() || `Professional cinematic quality`,
    platform: platform,
    sceneNumber,
    totalScenes
  };
}
