
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
    isMultiScene,
    sceneNumber,
    totalScenes
  } = request;
  
  const selectedPlatform = PLATFORM_PROMPTS[platform as keyof typeof PLATFORM_PROMPTS] || PLATFORM_PROMPTS.veo3;

  let systemPrompt = `${selectedPlatform.system}

**GOAL:** Describe a single, visually rich 8-second cinematic beat using professional film language.

**STRUCTURE & OUTPUT FORMAT:**
Transform user scene ideas into four distinct components using markdown headers:

### MAIN PROMPT  
A detailed, cinematic description optimized for AI video generation (keep under 200 words)

### TECHNICAL SPECS
Platform-specific technical parameters and settings (keep under 200 words) 

### STYLE NOTES
Visual style, mood, and artistic direction (keep under 200 words)

### METADATA
Structured scene information for continuity in JSON format

**CREATIVE RULES:**
1. **8-Second Scope**: Describe only what happens in 8 seconds - one clear action, emotion, or visual moment
2. **Visual Focus**: Prioritize what the camera sees - composition, movement, lighting, color
3. **Professional Language**: Use industry-standard cinematography and lighting terminology
4. **Specificity**: Choose precise descriptive words over generic ones
5. **Character Descriptions**: When characters appear, provide brief but vivid physical descriptions for visual consistency
6. **DO NOT GENERATE SUBTITLES**: Never include subtitle formatting, dialogue cards, or text overlays in any section

**TECHNICAL RULES:**
1. **Platform Optimization**: Tailor technical specs to the selected platform's strengths and limitations
2. **Camera Work**: Specify exact shots, movements, and angles using professional terminology
3. **Lighting Design**: Detail lighting setups, color temperature, and mood-appropriate illumination
4. **Production Quality**: Include technical details that ensure professional-grade output

**DIALOGUE HANDLING RULES:**
- **With Dialogue**: If dialogue is specified, integrate it naturally into the scene description without subtitle formatting
- **Without Dialogue**: Focus purely on visual storytelling, body language, and environmental sounds
- **Never Include**: Subtitle formatting ([Name]: "dialogue"), dialogue cards, or text overlays

**FINAL CHECKLIST:**
✓ Describes exactly 8 seconds of action
✓ Uses professional cinematography language
✓ Includes specific character descriptions when needed
✓ Platform-optimized technical specifications
✓ NO subtitle formatting anywhere
✓ Proper markdown headers (### MAIN PROMPT, ### TECHNICAL SPECS, ### STYLE NOTES, ### METADATA)

Current scene emotion/mood: ${emotion}
User subscription tier: ${tier?.toUpperCase()}`;


  // Add dialog specifications or explicit no-dialog instruction
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
  } else {
    // Explicitly instruct to avoid dialogue when not requested
    systemPrompt += `\n\nIMPORTANT - NO DIALOGUE INSTRUCTION:
DO NOT include any dialogue, conversations, spoken words, or narration in your prompts unless specifically requested. Focus purely on visual cinematography, camera work, lighting, and scene composition. The scene should be entirely visual without any verbal communication between characters.`;
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

  // Add scene continuity instructions if this is a multi-scene project
  if (sceneContext && isMultiScene) {
    systemPrompt += `\n\nSCENE CONTINUITY REQUIREMENTS:
This is scene ${sceneNumber} of ${totalScenes} in a multi-scene story. You MUST maintain consistency with the previous scene:

PREVIOUS SCENE CONTEXT:
- Scene excerpt: "${sceneContext.sceneExcerpt}"
- Established characters: ${sceneContext.characters.join(', ')}
- Location: ${sceneContext.location}
- Visual style: ${sceneContext.visualStyle}
- Mood: ${sceneContext.mood}
- Key elements: ${sceneContext.keyElements.join(', ')}

CONTINUITY INSTRUCTIONS:
- Maintain the same characters throughout (same appearance, clothing, mannerisms)
- Keep the established location or provide smooth transitions if changing locations
- Preserve the visual style and color palette from the previous scene
- Continue the emotional and narrative progression naturally
- Reference elements from the previous scene to create narrative flow
- Ensure technical specs (lighting, camera work) feel consistent with the established style
- Progress the story logically from the previous scene's context`;
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
  
  // Parse using markdown headers - match the first occurrence of each section
  const mainPromptMatch = generatedContent.match(/###\s*MAIN PROMPT\s*\n([\s\S]*?)(?=###\s*TECHNICAL SPECS|###\s*STYLE NOTES|###\s*METADATA|$)/i);
  const technicalSpecsMatch = generatedContent.match(/###\s*TECHNICAL SPECS\s*\n([\s\S]*?)(?=###\s*STYLE NOTES|###\s*METADATA|$)/i);
  const styleNotesMatch = generatedContent.match(/###\s*STYLE NOTES\s*\n([\s\S]*?)(?=###\s*METADATA|$)/i);
  const metadataMatch = generatedContent.match(/###\s*METADATA\s*\n([\s\S]*?)$/i);
  
  // Extract and clean each section
  const mainPrompt = mainPromptMatch?.[1]?.trim() || generatedContent;
  const technicalSpecs = technicalSpecsMatch?.[1]?.trim() || selectedPlatform.technical;
  const styleNotes = styleNotesMatch?.[1]?.trim() || "Professional cinematic quality";
  
  // Parse metadata more robustly
  let metadata = defaultMetadata;
  if (metadataMatch) {
    try {
      const metadataText = metadataMatch[1].trim();
      
      // Try to find JSON block more accurately
      const jsonMatch = metadataText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsedMetadata = JSON.parse(jsonMatch[0]);
        // Ensure all required fields exist with proper types
        metadata = {
          characters: Array.isArray(parsedMetadata.characters) ? parsedMetadata.characters : [],
          location: typeof parsedMetadata.location === 'string' ? parsedMetadata.location : defaultMetadata.location,
          timeOfDay: typeof parsedMetadata.timeOfDay === 'string' ? parsedMetadata.timeOfDay : defaultMetadata.timeOfDay,
          mood: typeof parsedMetadata.mood === 'string' ? parsedMetadata.mood : defaultMetadata.mood,
          visualStyle: typeof parsedMetadata.visualStyle === 'string' ? parsedMetadata.visualStyle : defaultMetadata.visualStyle,
          keyProps: Array.isArray(parsedMetadata.keyProps) ? parsedMetadata.keyProps : [],
          colorPalette: Array.isArray(parsedMetadata.colorPalette) ? parsedMetadata.colorPalette : [],
          cameraWork: typeof parsedMetadata.cameraWork === 'string' ? parsedMetadata.cameraWork : defaultMetadata.cameraWork,
          lighting: typeof parsedMetadata.lighting === 'string' ? parsedMetadata.lighting : defaultMetadata.lighting,
          storyElements: Array.isArray(parsedMetadata.storyElements) ? parsedMetadata.storyElements : []
        };
      }
    } catch (error) {
      console.error('Failed to parse metadata, using defaults:', error);
    }
  }
  
  return {
    mainPrompt,
    technicalSpecs,
    styleNotes,
    platform: platform,
    metadata,
    sceneNumber,
    totalScenes
  };
}
