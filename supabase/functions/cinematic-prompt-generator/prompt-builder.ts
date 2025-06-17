
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
    previousScenePrompts,
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

  // Add enhanced multi-scene context if applicable
  if (isMultiScene && previousScenePrompts && previousScenePrompts.length > 0) {
    systemPrompt += `\n\nMULTI-SCENE PROJECT CONTEXT:
This is Scene ${sceneNumber} of ${totalScenes} in a cinematic sequence.

CRITICAL CONTINUITY REQUIREMENTS:
- Maintain EXACT character appearances, clothing, and physical characteristics from previous scenes
- Preserve environmental details, lighting consistency, and atmospheric elements
- Ensure emotional and narrative progression flows naturally from the established story arc
- Keep the same visual style, color palette, and cinematographic approach
- Use smooth transitional elements that connect naturally to the previous scene
- Characters should maintain consistent mannerisms, speech patterns, and personality traits

DETAILED PREVIOUS SCENE CONTEXT:`;

    previousScenePrompts.forEach((prevScene) => {
      systemPrompt += `\n\n--- SCENE ${prevScene.sceneNumber} REFERENCE ---
Scene Idea: ${prevScene.sceneIdea}

Visual Description: ${prevScene.mainPrompt.substring(0, 300)}...

Technical Elements: ${prevScene.technicalSpecs.substring(0, 200)}...

Style & Mood: ${prevScene.styleNotes.substring(0, 200)}...`;
    });

    systemPrompt += `\n\nWhen generating Scene ${sceneNumber}, you MUST:
1. Reference specific visual elements from the previous scenes (character clothing, hair, facial features, environment details)
2. Maintain the established lighting mood and color palette
3. Ensure the new scene feels like a natural continuation of the story
4. Use consistent camera work and cinematographic style
5. Keep character consistency paramount - if a character wore a red jacket in Scene 1, they should still be wearing it unless the story specifically requires a change`;
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
