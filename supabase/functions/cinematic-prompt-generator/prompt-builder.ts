
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

Your task is to transform user scene ideas into four distinct components:

1. MAIN PROMPT: A detailed, cinematic description optimized for AI video generation
2. TECHNICAL SPECS: Platform-specific technical parameters and settings
3. STYLE NOTES: Visual style, mood, and artistic direction
4. METADATA: Structured scene information for continuity (JSON format)

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

CRITICAL CONTINUITY REQUIREMENTS:
- EXACT character appearance consistency: Keep faces, hair, clothing, and physical traits identical
- PRECISE environmental continuity: Maintain the same locations, lighting conditions, and time of day unless explicitly changing
- SEAMLESS narrative flow: This scene should feel like the immediate next moment in the story
- CONSISTENT visual language: Use identical camera styles, color grading, and cinematographic approach
- CHARACTER BEHAVIOR: Maintain established personality traits, speech patterns, and mannerisms

ENHANCED STORY CONTEXT (extracted from previous scenes):
${sceneContext}

INSTRUCTIONS: Generate this scene as a direct continuation that could be edited seamlessly with the previous footage. Focus on maintaining visual and narrative consistency above all else.`;
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

  // Add metadata requirements
  systemPrompt += `\n\nMETADATA REQUIREMENTS:
Provide a JSON object in the METADATA section with the following structure:
{
  "characters": ["list of character names/descriptions"],
  "location": "primary location description",
  "timeOfDay": "time of day (morning/afternoon/evening/night)",
  "mood": "emotional mood of the scene",
  "visualStyle": "visual style description",
  "keyProps": ["important props or objects in the scene"],
  "colorPalette": ["dominant colors in the scene"],
  "cameraWork": "camera movement and positioning description",
  "lighting": "lighting setup description",
  "storyElements": ["key story beats or narrative elements"]
}

This metadata will be used for scene continuity and context building.`;

  return systemPrompt;
}

export function parsePromptResponse(generatedContent: string, platform: string, sceneNumber?: number, totalScenes?: number) {
  const selectedPlatform = PLATFORM_PROMPTS[platform as keyof typeof PLATFORM_PROMPTS] || PLATFORM_PROMPTS.veo3;
  
  // Parse the response into structured sections
  const sections = generatedContent.split(/(?:MAIN PROMPT:|TECHNICAL SPECS:|STYLE NOTES:|METADATA:)/i);
  
  // Default metadata structure
  const defaultMetadata = {
    characters: [],
    location: "Unknown location",
    timeOfDay: "day",
    mood: "neutral",
    visualStyle: "cinematic",
    keyProps: [],
    colorPalette: [],
    cameraWork: "standard framing",
    lighting: "natural lighting",
    storyElements: []
  };
  
  // Try to parse metadata from the response
  let metadata = defaultMetadata;
  if (sections[4]) {
    try {
      const metadataText = sections[4].trim();
      // Extract JSON from the text
      const jsonMatch = metadataText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsedMetadata = JSON.parse(jsonMatch[0]);
        metadata = { ...defaultMetadata, ...parsedMetadata };
      }
    } catch (error) {
      console.error('Failed to parse metadata, using defaults:', error);
    }
  }
  
  return {
    mainPrompt: sections[1]?.trim() || generatedContent,
    technicalSpecs: sections[2]?.trim() || selectedPlatform.technical,
    styleNotes: sections[3]?.trim() || `Professional cinematic quality`,
    platform: platform,
    sceneNumber,
    totalScenes,
    metadata
  };
}
